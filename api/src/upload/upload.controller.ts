import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@Controller('uploads')
export class UploadController {
  private tagsCacheLastUpdate: number = 0;
  private tagsCacheData: string[] = [];
  private readonly TAGS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService,
  ) {}

  /**
   * Route d'upload pour les photographes et admins
   * POST /uploads/photographer
   * Authentification requise (rôle PHOTOGRAPHER ou ADMIN)
   * Pas de limite de taille
   */
  @Post('photographer')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('PHOTOGRAPHER', 'ADMIN', 'DEV')
  @UseInterceptors(FilesInterceptor('images', 100)) // Max 100 fichiers par requête
  async uploadPhotographerImages(
    @UploadedFiles() files: any[],
    @Req() req: any,
    @Body() body: any,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('Aucun fichier n\'a été fourni', HttpStatus.BAD_REQUEST);
    }

    try {
      // Récupérer l'utilisateur depuis le token JWT
      const userId = req.user.id;
      const eventId = body.eventId || null;

      // Pas de limite de taille pour les photographes
      // Créer les versions responsive des images
      const uploadedUuids = await this.uploadService.uploadFiles(files, 999, true);

      // Créer les enregistrements Photo dans la base de données
      const createdPhotos: any[] = [];
      for (const uuid of uploadedUuids) {
        const photo = await this.prisma.photo.create({
          data: {
            image: uuid,
            userId: userId,
            eventId: eventId || undefined,
            tags: [],
          },
        });
        createdPhotos.push(photo);
      }

      return {
        success: true,
        count: uploadedUuids.length,
        uuids: uploadedUuids,
        photos: createdPhotos,
        message: `${uploadedUuids.length} image(s) uploadée(s) avec succès`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Route d'upload pour l'image d'un événement
   * POST /uploads/event
   * Authentification requise (rôle ADMIN)
   */
  @Post('event')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadEventImage(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('Aucun fichier n\'a été fourni', HttpStatus.BAD_REQUEST);
    }

    try {
      // Upload l'image avec création des versions responsive (thumbnail, small, medium, large)
      const uuid = await this.uploadService.uploadFile(file, 999, true);

      return {
        success: true,
        uuid: uuid,
        filename: uuid,
        message: 'Image uploadée avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Route publique pour récupérer TOUTES les photos
   * GET /uploads/all
   * Sans authentification
   * IMPORTANT: Doit être AVANT les routes avec paramètres
   */
  @Get('all')
  async getAllPhotos() {
    try {
      const photos = await this.prisma.photo.findMany({
        select: {
          id: true,
          image: true,
          createdAt: true,
          tags: true,
          user: {
            select: {
              username: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              date: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        count: photos.length,
        photos: photos,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Route protégée pour récupérer les photos avec pagination et filtres
   * GET /uploads/user-photos?page=1&limit=10&eventId=xxx&search=xxx&taggedByUsername=xxx
   * - Les photographes voient uniquement leurs propres photos
   * - Les admins et devs voient TOUTES les photos
   * Authentification requise
   * Paramètres:
   *   - page (optionnel, défaut 1): Numéro de page
   *   - limit (optionnel, défaut 12): Nombre de photos par page
   *   - eventId (optionnel): Filtrer par ID d'événement (exclut les photos sans événement)
   *   - noEvent (optionnel): Si true, retourner seulement les photos sans événement
   *   - search (optionnel): Rechercher par tags ou nom d'utilisateur
   *   - taggedByUsername (optionnel): Filtrer par nom d'utilisateur dans les tags
   * IMPORTANT: Doit être AVANT les routes avec paramètres
   */
  @Get('user-photos')
  @UseGuards(JwtGuard)
  async getUserPhotos(@Req() req: any) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const page = Math.max(1, parseInt(req.query.page || '1', 10));
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '12', 10)));
      const offset = (page - 1) * limit;

      // Récupérer les filtres
      const eventId = req.query.eventId || null;
      const noEvent = req.query.noEvent === 'true';
      const search = (req.query.search || '').trim().toLowerCase();
      const taggedByUsername = req.query.taggedByUsername || null;

      // Construire les conditions WHERE avec paramètres liés
      const params: any[] = [];
      let whereConditions: string[] = [];

      // Les photographes voient seulement leurs propres photos, les admins/devs voient tout
      if (userRole !== 'ADMIN' && userRole !== 'DEV') {
        whereConditions.push(`p."userId" = $${params.length + 1}`);
        params.push(userId);
      }

      // Filtre par événement
      if (noEvent) {
        whereConditions.push(`p."eventId" IS NULL`);
      } else if (eventId) {
        whereConditions.push(`p."eventId" = $${params.length + 1}`);
        params.push(eventId);
      }

      // Filtre par tag spécifique (utilisateur taggé) - match exact
      if (taggedByUsername) {
        // tags est un tableau text[], donc utiliser l'opérateur @> (contient)
        whereConditions.push(`p.tags @> ARRAY[$${params.length + 1}]::text[]`);
        params.push(taggedByUsername);
      }

      // Filtre par recherche texte (tags OU nom d'utilisateur)
      if (search) {
        const searchWithWildcard = `%${search}%`;
        whereConditions.push(`(
          p.tags @> ARRAY[$${params.length + 1}]::text[]
          OR EXISTS (
            SELECT 1 FROM unnest(p.tags) AS tag
            WHERE tag ILIKE $${params.length + 2}
          )
          OR u.username ILIKE $${params.length + 2}
        )`);
        params.push(search);
        params.push(searchWithWildcard);
      }

      const whereClause = whereConditions.length > 0 ? ` WHERE ${whereConditions.join(' AND ')}` : ' WHERE 1=1';

      // Get total count with optimized query
      const countResult: any = await this.prisma.$queryRawUnsafe(
        `SELECT COUNT(DISTINCT p.id)::integer as total FROM photos p
         LEFT JOIN users u ON p."userId" = u.id${whereClause}`,
        ...params
      );
      const totalCount = countResult[0].total;

      // Get paginated photos
      const photos: any = await this.prisma.$queryRawUnsafe(
        `SELECT
          p.id,
          p.image,
          p."createdAt",
          p.tags,
          p."userId",
          json_build_object(
            'id', u.id,
            'email', u.email,
            'username', u.username,
            'role', u.role
          ) as "user",
          CASE
            WHEN p."eventId" IS NOT NULL THEN json_build_object(
              'id', e.id,
              'title', e.title,
              'date', e.date
            )
            ELSE NULL
          END as "event"
        FROM photos p
        LEFT JOIN users u ON p."userId" = u.id
        LEFT JOIN events e ON p."eventId" = e.id${whereClause}
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}`,
        ...params
      );

      return {
        success: true,
        count: photos?.length || 0,
        totalCount: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
        photos: photos,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Route protégée pour rechercher des tags et noms d'utilisateurs pour autocomplete
   * GET /uploads/tags/autocomplete?search=query
   * Authentification requise
   * Paramètres:
   *   - search (optionnel): Chaîne de recherche pour filtrer les résultats
   * Retourne les tags des photos ET les noms d'utilisateurs filtrés
   * IMPORTANT: Doit être AVANT les routes avec paramètres
   */
  @Get('tags/autocomplete')
  @UseGuards(JwtGuard)
  async getTagsAutocomplete(@Req() req: any) {
    try {
      const search = (req.query.search || '').trim().toLowerCase();
      const limit = 10;

      // Si pas de recherche, utiliser le cache pour les tags complets
      let allTags = new Set<string>();

      if (!search) {
        // Vérifier le cache
        const now = Date.now();
        if (now - this.tagsCacheLastUpdate < this.TAGS_CACHE_DURATION && this.tagsCacheData.length > 0) {
          return {
            success: true,
            tags: this.tagsCacheData.slice(0, limit),
          };
        }

        // Cache expiré, récupérer tous les tags
        const allPhotoTags = await this.prisma.photoTag.findMany({
          orderBy: { name: 'asc' },
        });

        const allUsers = await this.prisma.user.findMany({
          select: { username: true },
          where: { username: { not: null } },
          orderBy: { username: 'asc' },
        });

        allPhotoTags.forEach((t) => allTags.add(t.name));
        allUsers.forEach((u) => {
          if (u.username) {
            allTags.add(u.username);
          }
        });

        // Mettre en cache
        const sortedTags = Array.from(allTags).sort();
        this.tagsCacheData = sortedTags;
        this.tagsCacheLastUpdate = now;

        return {
          success: true,
          tags: sortedTags.slice(0, limit),
        };
      }

      // Avec recherche, filtrer directement
      const photoTags = await this.prisma.photoTag.findMany({
        select: { name: true },
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
        take: limit,
      });

      const users = await this.prisma.user.findMany({
        select: { username: true },
        where: {
          username: {
            not: null,
            contains: search,
            mode: 'insensitive',
          },
        },
        orderBy: { username: 'asc' },
        take: limit,
      });

      photoTags.forEach((t) => allTags.add(t.name));
      users.forEach((u) => {
        if (u.username) {
          allTags.add(u.username);
        }
      });

      return {
        success: true,
        tags: Array.from(allTags).sort().slice(0, limit),
      };
    } catch {
      throw new HttpException('Error fetching autocomplete suggestions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Route publique pour récupérer les images avec 3 paramètres
   * GET /uploads/:folder/:subfolder/:filename
   * Exemple: /uploads/thumbnail/550e8400-e29b-41d4-a716-446655440000.jpg
   */
  @Get(':folder/:subfolder/:filename')
  getImageWithSubfolder(
    @Param('folder') folder: string,
    @Param('subfolder') subfolder: string,
    @Param('filename') filename: string,
    @Res() res: any
  ) {
    return this.serveImage(folder, subfolder, filename, res);
  }

  /**
   * Route publique pour récupérer les images avec 2 paramètres
   * GET /uploads/:folder/:filename
   */
  @Get(':folder/:filename')
  getImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: any
  ) {
    return this.serveImage(folder, filename, '', res);
  }

  /**
   * Route protégée pour régénérer les images responsives
   * POST /uploads/regenerate-responsive
   * Authentification requise (rôle DEV seulement)
   * Supprime les images responsives existantes et les régénère à partir de l'original
   */
  @Post('regenerate-responsive')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DEV')
  async regenerateResponsiveImages() {
    try {
      const result = await this.uploadService.regenerateAllResponsiveImages();
      return {
        success: true,
        message: 'Images responsives régénérées avec succès',
        result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Méthode interne pour servir les images
   */
  private serveImage(folder: string, filenameOrSubfolder: string, maybeFilename: string, res: any) {
    const allowedFolders = ['original', 'thumbnail', 'small', 'medium', 'large'];

    if (!allowedFolders.includes(folder)) {
      throw new HttpException('Dossier non valide', HttpStatus.BAD_REQUEST);
    }

    // Déterminer le chemin du fichier
    let filepath: string;
    let actualFilename: string;

    if (maybeFilename) {
      // Route avec 3 paramètres
      filepath = path.join('uploads', folder, filenameOrSubfolder, maybeFilename);
      actualFilename = maybeFilename;
    } else {
      // Route avec 2 paramètres
      filepath = path.join('uploads', folder, filenameOrSubfolder);
      actualFilename = filenameOrSubfolder;
    }

    // Vérifier que le chemin reste dans le dossier uploads
    const uploadDir = path.resolve('uploads');
    const resolvedPath = path.resolve(filepath);

    if (!resolvedPath.startsWith(uploadDir)) {
      throw new HttpException('Accès non autorisé', HttpStatus.FORBIDDEN);
    }

    // Vérifier que le fichier existe
    if (!fs.existsSync(filepath)) {
      throw new HttpException('Image non trouvée', HttpStatus.NOT_FOUND);
    }

    // Déterminer le type MIME basé sur l'extension
    const ext = path.extname(actualFilename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 an de cache

    // Envoyer le fichier
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Erreur lors de la lecture du fichier:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erreur lors de la lecture du fichier');
    });
  }
}

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
   * Route protégée pour récupérer les photos de l'utilisateur
   * GET /uploads/user-photos
   * Authentification requise
   * IMPORTANT: Doit être AVANT les routes avec paramètres
   */
  @Get('user-photos')
  @UseGuards(JwtGuard)
  async getUserPhotos(@Req() req: any) {
    try {
      const userId = req.user.id;

      const photos = await this.prisma.photo.findMany({
        where: { userId: userId },
        select: {
          id: true,
          image: true,
          createdAt: true,
          tags: true,
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
   * Authentification requise (rôle DEV ou ADMIN)
   * Supprime les images responsives existantes et les régénère à partir de l'original
   */
  @Post('regenerate-responsive')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('DEV', 'ADMIN')
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

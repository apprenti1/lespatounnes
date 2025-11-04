import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadService } from './upload.service';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  /**
   * Route d'upload pour les photographes
   * POST /uploads/photographer
   * Authentification requise (rôle PHOTOGRAPHER)
   * Pas de limite de taille
   */
  @Post('photographer')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('PHOTOGRAPHER')
  @UseInterceptors(FilesInterceptor('images', 100)) // Max 100 fichiers par requête
  async uploadPhotographerImages(
    @UploadedFiles() files: any[],
    @Req() req: any
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('Aucun fichier n\'a été fourni', HttpStatus.BAD_REQUEST);
    }

    try {
      // Pas de limite de taille pour les photographes
      const uploadedUuids = await this.uploadService.uploadFiles(files, 999, true);

      return {
        success: true,
        count: uploadedUuids.length,
        uuids: uploadedUuids,
        message: `${uploadedUuids.length} image(s) uploadée(s) avec succès`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Route publique pour récupérer les images
   * GET /uploads/:folder/:filename
   * Exemple: /uploads/original/550e8400-e29b-41d4-a716-446655440000.jpg
   */
  @Get(':folder/:filename(*)')
  getImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: any
  ) {
    // Valider le dossier pour éviter les traversées de répertoires
    const allowedFolders = ['original', 'thumbnail', 'small', 'medium', 'large'];
    if (!allowedFolders.includes(folder)) {
      throw new HttpException('Dossier non valide', HttpStatus.BAD_REQUEST);
    }

    const filepath = path.join('uploads', folder, filename);

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
    const ext = path.extname(filename).toLowerCase();
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

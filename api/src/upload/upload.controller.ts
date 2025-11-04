import { Controller, Get, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('uploads')
export class UploadController {
  /**
   * Route publique pour récupérer les images
   * GET /uploads/:folder/:filename
   * Exemple: /uploads/original/550e8400-e29b-41d4-a716-446655440000.jpg
   */
  @Get(':folder/:filename')
  getImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response
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

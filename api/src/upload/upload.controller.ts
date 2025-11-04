import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
}

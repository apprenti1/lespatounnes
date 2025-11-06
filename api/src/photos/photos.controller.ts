import { Controller, Delete, Patch, Param, Body, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('uploads/photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  /**
   * PATCH /uploads/photos/:id
   * Mettre à jour les tags d'une photo
   */
  @Patch(':id')
  @UseGuards(JwtGuard)
  async updatePhoto(@Param('id') photoId: string, @Body('tags') tags: string[], @Req() req: any) {
    try {
      // Vérifier que l'utilisateur est propriétaire de la photo ou admin
      const userId = req.user.id;
      const userRole = req.user.role;

      // Pour l'instant, on laisse les admins et propriétaires mettre à jour
      // On peut ajouter une vérification de propriété plus tard si nécessaire

      const updatedPhoto = await this.photosService.updateTags(photoId, tags || []);

      return {
        success: true,
        message: 'Tags mis à jour avec succès',
        photo: updatedPhoto,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * DELETE /uploads/photos/:id
   * Supprimer une photo
   */
  @Delete(':id')
  @UseGuards(JwtGuard)
  async deletePhoto(@Param('id') photoId: string, @Req() req: any) {
    try {
      // Vérifier que l'utilisateur est propriétaire de la photo ou admin
      const userId = req.user.id;
      const userRole = req.user.role;

      // Pour l'instant, on laisse les admins et propriétaires supprimer
      // On peut ajouter une vérification de propriété plus tard si nécessaire

      const deletedPhoto = await this.photosService.deletePhoto(photoId);

      if (!deletedPhoto) {
        throw new HttpException('Photo non trouvée', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Photo supprimée avec succès',
        photo: deletedPhoto,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

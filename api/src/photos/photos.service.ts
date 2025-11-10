import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async updateTags(photoId: string, tags: string[]) {
    // Enregistrer les nouveaux tags dans la table PhotoTag
    for (const tag of tags) {
      const trimmedTag = tag.trim();
      if (trimmedTag) {
        await this.prisma.photoTag.upsert({
          where: { name: trimmedTag },
          update: {},
          create: { name: trimmedTag },
        });
      }
    }

    // Mettre à jour les tags de la photo
    return await this.prisma.photo.update({
      where: { id: photoId },
      data: { tags },
    });
  }

  async deletePhoto(photoId: string) {
    // Récupérer la photo pour obtenir l'UUID
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return null;
    }

    // Supprimer les fichiers du disque
    const imageName = photo.image;
    const folders = ['original', 'thumbnail', 'small', 'medium', 'large'];

    for (const folder of folders) {
      const filePath = path.join('uploads', folder, `${imageName}`);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression du fichier ${filePath}:`, error);
      }
    }

    // Supprimer l'enregistrement de la base de données
    return await this.prisma.photo.delete({
      where: { id: photoId },
    });
  }
}

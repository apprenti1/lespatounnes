import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export interface ResizeConfig {
  width: number;
  height: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

@Injectable()
export class ResizeService {
  private uploadDir = 'uploads';
  private folders = {
    original: 'uploads/original',
    thumbnail: 'uploads/thumbnail',
    small: 'uploads/small',
    medium: 'uploads/medium',
    large: 'uploads/large',
  };

  constructor() {
    // Créer tous les dossiers
    Object.values(this.folders).forEach((folder) => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
    });
  }

  /**
   * Crée des versions responsive d'une image
   * @param imagePath - Chemin du fichier image original
   * @param uuid - UUID du fichier
   * @returns void (les fichiers sont sauvegardés dans les dossiers respectifs)
   */
  async createResponsiveImages(
    imagePath: string,
    uuid: string
  ): Promise<void> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Le fichier ${imagePath} n'existe pas`);
    }

    const extension = path.extname(uuid);

    try {
      // Thumbnail: 150x150
      await this.resizeImage(imagePath, this.folders.thumbnail, uuid, {
        width: 150,
        height: 150,
        fit: 'cover',
      });

      // Small: 400x300
      await this.resizeImage(imagePath, this.folders.small, uuid, {
        width: 400,
        height: 300,
        fit: 'cover',
      });

      // Medium: 800x600
      await this.resizeImage(imagePath, this.folders.medium, uuid, {
        width: 800,
        height: 600,
        fit: 'cover',
      });

      // Large: 1200x900
      await this.resizeImage(imagePath, this.folders.large, uuid, {
        width: 1200,
        height: 900,
        fit: 'cover',
      });
    } catch (error) {
      console.error('Erreur lors du redimensionnement:', error);
      throw new Error(`Impossible de redimensionner l'image: ${error.message}`);
    }
  }

  /**
   * Redimensionne une image avec la config spécifiée
   * @param sourcePath - Chemin du fichier source
   * @param folder - Dossier de destination
   * @param filename - Nom du fichier de sortie
   * @param config - Configuration de redimensionnement
   */
  private async resizeImage(
    sourcePath: string,
    folder: string,
    filename: string,
    config: ResizeConfig
  ): Promise<void> {
    const outputPath = path.join(folder, filename);

    await sharp(sourcePath)
      .resize(config.width, config.height, {
        fit: config.fit || 'cover',
        position: 'center',
      })
      .toFile(outputPath);
  }

  /**
   * Supprime uniquement les versions responsive d'une image (préserve l'original)
   * @param uuid - UUID du fichier (avec extension)
   */
  deleteResponsiveImages(uuid: string): void {
    const foldersToDelete = [
      this.folders.thumbnail,
      this.folders.small,
      this.folders.medium,
      this.folders.large,
    ];

    for (const folder of foldersToDelete) {
      const filepath = path.join(folder, uuid);
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch (error) {
          console.error(`Erreur lors de la suppression de ${filepath}:`, error);
        }
      }
    }
  }

  /**
   * Obtenir les infos d'une image
   */
  async getImageInfo(imagePath: string): Promise<{ width: number; height: number }> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Le fichier ${imagePath} n'existe pas`);
    }

    try {
      const metadata = await sharp(imagePath).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    } catch (error) {
      throw new Error(`Impossible de lire les infos de l'image: ${error.message}`);
    }
  }
}

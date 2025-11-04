import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export interface ResizeConfig {
  width: number;
  height: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface ResponsiveImages {
  original: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
}

@Injectable()
export class ResizeService {
  private uploadDir = 'uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Crée des versions responsive d'une image
   * @param imagePath - Chemin du fichier image original
   * @param filename - Nom du fichier (sans extension)
   * @returns Objet contenant les chemins des différentes versions
   */
  async createResponsiveImages(
    imagePath: string,
    filename: string
  ): Promise<ResponsiveImages> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Le fichier ${imagePath} n'existe pas`);
    }

    const extension = path.extname(filename);
    const nameWithoutExt = path.basename(filename, extension);
    const responsiveImages: ResponsiveImages = {
      original: `/uploads/${filename}`,
    };

    try {
      // Thumbnail: 150x150
      const thumbnailName = `${nameWithoutExt}-thumbnail${extension}`;
      await this.resizeImage(imagePath, thumbnailName, {
        width: 150,
        height: 150,
        fit: 'cover',
      });
      responsiveImages.thumbnail = `/uploads/${thumbnailName}`;

      // Small: 400x300
      const smallName = `${nameWithoutExt}-small${extension}`;
      await this.resizeImage(imagePath, smallName, {
        width: 400,
        height: 300,
        fit: 'cover',
      });
      responsiveImages.small = `/uploads/${smallName}`;

      // Medium: 800x600
      const mediumName = `${nameWithoutExt}-medium${extension}`;
      await this.resizeImage(imagePath, mediumName, {
        width: 800,
        height: 600,
        fit: 'cover',
      });
      responsiveImages.medium = `/uploads/${mediumName}`;

      // Large: 1200x900
      const largeName = `${nameWithoutExt}-large${extension}`;
      await this.resizeImage(imagePath, largeName, {
        width: 1200,
        height: 900,
        fit: 'cover',
      });
      responsiveImages.large = `/uploads/${largeName}`;

      return responsiveImages;
    } catch (error) {
      console.error('Erreur lors du redimensionnement:', error);
      throw new Error(`Impossible de redimensionner l'image: ${error.message}`);
    }
  }

  /**
   * Redimensionne une image avec la config spécifiée
   * @param sourcePath - Chemin du fichier source
   * @param outputFilename - Nom du fichier de sortie
   * @param config - Configuration de redimensionnement
   */
  private async resizeImage(
    sourcePath: string,
    outputFilename: string,
    config: ResizeConfig
  ): Promise<void> {
    const outputPath = path.join(this.uploadDir, outputFilename);

    await sharp(sourcePath)
      .resize(config.width, config.height, {
        fit: config.fit || 'cover',
        position: 'center',
      })
      .toFile(outputPath);
  }

  /**
   * Redimensionne une image avec une config personnalisée
   * @param imagePath - Chemin du fichier image
   * @param outputFilename - Nom du fichier de sortie
   * @param config - Configuration personnalisée
   */
  async resizeCustom(
    imagePath: string,
    outputFilename: string,
    config: ResizeConfig
  ): Promise<string> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Le fichier ${imagePath} n'existe pas`);
    }

    try {
      await this.resizeImage(imagePath, outputFilename, config);
      return `/uploads/${outputFilename}`;
    } catch (error) {
      throw new Error(`Impossible de redimensionner l'image: ${error.message}`);
    }
  }

  /**
   * Supprime toutes les versions responsive d'une image
   * @param baseFilename - Nom du fichier (avec extension)
   */
  deleteResponsiveImages(baseFilename: string): { deleted: string[]; failed: string[] } {
    const extension = path.extname(baseFilename);
    const nameWithoutExt = path.basename(baseFilename, extension);

    const variants = [
      baseFilename,
      `${nameWithoutExt}-thumbnail${extension}`,
      `${nameWithoutExt}-small${extension}`,
      `${nameWithoutExt}-medium${extension}`,
      `${nameWithoutExt}-large${extension}`,
    ];

    const deleted = [];
    const failed = [];

    for (const variant of variants) {
      const filepath = path.join(this.uploadDir, variant);
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
          deleted.push(variant);
        } catch (error) {
          failed.push(variant);
        }
      }
    }

    return { deleted, failed };
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

import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ResizeService, ResponsiveImages } from './resize.service';

@Injectable()
export class UploadService {
  private uploadDir = 'uploads';

  constructor(private resizeService: ResizeService) {
    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Upload un ou plusieurs fichiers images et retourne les routes publiques d'accès avec versions responsive
   * @param files - Fichiers à uploader
   * @param maxSizeInMB - Taille maximale en MB (par défaut 10MB)
   * @param createResponsive - Créer les versions responsive (par défaut true)
   */
  async uploadFiles(
    files: Express.Multer.File[],
    maxSizeInMB: number = 10,
    createResponsive: boolean = true
  ): Promise<{ publicPath: string; filename: string; responsive?: ResponsiveImages }[]> {
    if (!files || files.length === 0) {
      throw new Error('Aucun fichier n\'a été fourni');
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const uploadedFiles = [];

    for (const file of files) {
      // Vérifier que c'est une image
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedMimes.includes(file.mimetype)) {
        throw new Error(
          `Le fichier ${file.originalname} doit être une image (JPEG, PNG, WebP ou GIF)`
        );
      }

      // Vérifier la taille
      if (file.size > maxSizeInBytes) {
        throw new Error(
          `L'image ${file.originalname} ne doit pas dépasser ${maxSizeInMB}MB`
        );
      }

      // Générer un nom de fichier unique avec timestamp
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const extension = path.extname(file.originalname);
      const filename = `${timestamp}-${random}${extension}`;

      // Sauvegarder le fichier
      const filepath = path.join(this.uploadDir, filename);
      fs.writeFileSync(filepath, file.buffer);

      const uploadInfo: any = {
        publicPath: `/uploads/${filename}`,
        filename,
      };

      // Créer les versions responsive si demandé
      if (createResponsive) {
        try {
          uploadInfo.responsive = await this.resizeService.createResponsiveImages(
            filepath,
            filename
          );
        } catch (error) {
          console.error(`Erreur lors du redimensionnement de ${filename}:`, error);
          // Ne pas lever d'erreur, continuer avec juste l'image originale
        }
      }

      uploadedFiles.push(uploadInfo);
    }

    return uploadedFiles;
  }

  /**
   * Upload un fichier unique (alias pour uploadFiles avec un seul fichier)
   * @param file - Fichier à uploader
   * @param maxSizeInMB - Taille maximale en MB (par défaut 10MB)
   * @param createResponsive - Créer les versions responsive (par défaut true)
   */
  async uploadFile(
    file: Express.Multer.File,
    maxSizeInMB: number = 10,
    createResponsive: boolean = true
  ): Promise<{ publicPath: string; filename: string; responsive?: ResponsiveImages }> {
    const result = await this.uploadFiles([file], maxSizeInMB, createResponsive);
    return result[0];
  }

  /**
   * Obtenir le chemin complet d'un fichier uploadé
   */
  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  /**
   * Supprimer un ou plusieurs fichiers uploadés (original + versions responsive)
   */
  deleteFiles(filenames: string[]): { deleted: string[]; failed: string[] } {
    const deleted = [];
    const failed = [];

    for (const filename of filenames) {
      const filepath = this.getFilePath(filename);

      // Supprimer les versions responsive
      try {
        const responsiveResult = this.resizeService.deleteResponsiveImages(filename);
        deleted.push(...responsiveResult.deleted);
        failed.push(...responsiveResult.failed);
      } catch (error) {
        console.error(`Erreur lors de la suppression des versions responsive de ${filename}:`, error);
      }

      // Supprimer le fichier original
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
          deleted.push(filename);
        } catch (error) {
          failed.push(filename);
        }
      } else {
        failed.push(filename);
      }
    }

    return { deleted, failed };
  }

  /**
   * Supprimer un fichier unique (alias pour deleteFiles avec un seul fichier)
   */
  deleteFile(filename: string): boolean {
    const result = this.deleteFiles([filename]);
    return result.deleted.length > 0;
  }

  /**
   * Vérifier si un fichier existe
   */
  fileExists(filename: string): boolean {
    return fs.existsSync(this.getFilePath(filename));
  }
}

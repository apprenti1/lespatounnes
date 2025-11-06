import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ResizeService } from './resize.service';

interface FileUpload {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadService {
  private originalFolder: string;

  constructor(private resizeService: ResizeService) {
    // Utiliser un chemin absolu basé sur le répertoire de l'application
    this.originalFolder = path.join(process.cwd(), 'uploads', 'original');
    // Le dossier sera créé au moment de l'upload
  }

  /**
   * S'assurer qu'un répertoire existe, le créer sinon
   */
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Upload un ou plusieurs fichiers images et retourne leur UUID
   * @param files - Fichiers à uploader
   * @param maxSizeInMB - Taille maximale en MB (par défaut 10MB)
   * @param createResponsive - Créer les versions responsive (par défaut true)
   * @returns Tableau d'UUID
   */
  async uploadFiles(
    files: FileUpload[],
    maxSizeInMB: number = 10,
    createResponsive: boolean = true
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new Error('Aucun fichier n\'a été fourni');
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const uploadedUuids: string[] = [];

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

      // Générer un UUID avec extension
      const extension = path.extname(file.originalname);
      const uuid = `${uuidv4()}${extension}`;

      // S'assurer que le dossier original existe
      this.ensureDirectoryExists(this.originalFolder);

      // Sauvegarder le fichier original dans uploads/original
      const originalPath = path.join(this.originalFolder, uuid);
      fs.writeFileSync(originalPath, file.buffer);

      // Créer les versions responsive si demandé
      if (createResponsive) {
        try {
          await this.resizeService.createResponsiveImages(originalPath, uuid);
        } catch (error) {
          console.error(`Erreur lors du redimensionnement de ${uuid}:`, error);
          // Ne pas lever d'erreur, continuer avec juste l'image originale
        }
      }

      uploadedUuids.push(uuid);
    }

    return uploadedUuids;
  }

  /**
   * Upload un fichier unique (alias pour uploadFiles avec un seul fichier)
   * @param file - Fichier à uploader
   * @param maxSizeInMB - Taille maximale en MB (par défaut 10MB)
   * @param createResponsive - Créer les versions responsive (par défaut true)
   * @returns UUID du fichier
   */
  async uploadFile(
    file: FileUpload,
    maxSizeInMB: number = 10,
    createResponsive: boolean = true
  ): Promise<string> {
    const result = await this.uploadFiles([file], maxSizeInMB, createResponsive);
    return result[0];
  }

  /**
   * Obtenir le chemin complet d'un fichier original
   */
  getFilePath(uuid: string): string {
    return path.join(this.originalFolder, uuid);
  }

  /**
   * Supprimer un ou plusieurs fichiers uploadés (original + versions responsive)
   */
  deleteFiles(uuids: string[]): void {
    for (const uuid of uuids) {
      const filepath = this.getFilePath(uuid);

      // Supprimer les versions responsive
      try {
        this.resizeService.deleteResponsiveImages(uuid);
      } catch (error) {
        console.error(`Erreur lors de la suppression des versions responsive de ${uuid}:`, error);
      }

      // Supprimer le fichier original
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch (error) {
          console.error(`Erreur lors de la suppression de ${uuid}:`, error);
        }
      }
    }
  }

  /**
   * Supprimer un fichier unique
   */
  deleteFile(uuid: string): void {
    this.deleteFiles([uuid]);
  }

  /**
   * Vérifier si un fichier existe
   */
  fileExists(uuid: string): boolean {
    return fs.existsSync(this.getFilePath(uuid));
  }
}

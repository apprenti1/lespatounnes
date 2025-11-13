import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupérer tous les utilisateurs
   */
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Créer un nouvel utilisateur
   */
  async createUser(data: any) {
    const { username, email, password, firstName, lastName, role } = data;

    // Validation
    if (!username || !email || !password) {
      throw new BadRequestException('Username, email et password sont obligatoires');
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Cet utilisateur existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || 'USER',
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Mettre à jour un utilisateur (sans modifier le mot de passe)
   */
  async updateUser(id: string, data: any) {
    const { username, email, firstName, lastName, role } = data;

    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Vérifier que le nouvel email/username n'existe pas ailleurs
    if (email && email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        throw new BadRequestException('Ce pseudo est déjà utilisé');
      }
    }

    // Mettre à jour l'utilisateur
    return this.prisma.user.update({
      where: { id },
      data: {
        username: username || user.username,
        email: email || user.email,
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        role: role || user.role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(id: string) {
    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Supprimer l'utilisateur
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

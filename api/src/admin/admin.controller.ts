import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'DEV')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Récupérer tous les utilisateurs
   * GET /admin/users
   */
  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.adminService.getAllUsers();
      return {
        success: true,
        users,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Créer un nouvel utilisateur
   * POST /admin/users
   */
  @Post('users')
  async createUser(@Body() data: any) {
    try {
      const user = await this.adminService.createUser(data);
      return {
        success: true,
        user,
        message: 'Utilisateur créé avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Mettre à jour un utilisateur
   * PATCH /admin/users/:id
   */
  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    try {
      const user = await this.adminService.updateUser(id, data);
      return {
        success: true,
        user,
        message: 'Utilisateur mis à jour avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Supprimer un utilisateur
   * DELETE /admin/users/:id
   */
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.adminService.deleteUser(id);
      return {
        success: true,
        message: 'Utilisateur supprimé avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

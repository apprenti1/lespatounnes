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
  Request,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  /**
   * Récupérer tous les partenaires (public)
   * GET /partners
   */
  @Get()
  async getAllPartners() {
    try {
      const partners = await this.partnersService.getAllPartners();
      return {
        success: true,
        partners,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupérer le code promo d'un partenaire (authentification + vérification isMember requise)
   * GET /partners/:id/promo
   * IMPORTANT: Cette route doit être AVANT @Get(':id') pour être matchée correctement
   */
  @Get(':id/promo')
  @UseGuards(JwtGuard)
  async getPartnerPromo(@Param('id') id: string, @Request() request: any) {
    try {
      // Récupérer l'utilisateur depuis le request (injecté par JwtGuard)
      const user = request.user;

      // Vérifier que l'utilisateur est membre
      if (!user || !user.isMember) {
        throw new HttpException('Accès réservé aux adhérents', HttpStatus.FORBIDDEN);
      }

      const partner = await this.partnersService.getPartnerById(id);
      if (!partner) {
        throw new HttpException('Partenaire non trouvé', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        promoCode: partner.promoCode,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupérer les détails d'un partenaire sans le code promo (public)
   * GET /partners/:id
   */
  @Get(':id')
  async getPartnerDetails(@Param('id') id: string) {
    try {
      const partner = await this.partnersService.getPartnerById(id);
      if (!partner) {
        throw new HttpException('Partenaire non trouvé', HttpStatus.NOT_FOUND);
      }

      // Exclure le code promo pour les utilisateurs non authentifiés
      const { promoCode, ...partnerWithoutPromo } = partner;

      return {
        success: true,
        partner: partnerWithoutPromo,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Créer un nouveau partenaire
   * POST /partners
   */
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'DEV')
  async createPartner(@Body() data: any) {
    try {
      const partner = await this.partnersService.createPartner(data);
      return {
        success: true,
        partner,
        message: 'Partenaire créé avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Mettre à jour un partenaire
   * PATCH /partners/:id
   */
  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'DEV')
  async updatePartner(@Param('id') id: string, @Body() data: any) {
    try {
      const partner = await this.partnersService.updatePartner(id, data);
      return {
        success: true,
        partner,
        message: 'Partenaire mis à jour avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Supprimer un partenaire
   * DELETE /partners/:id
   */
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'DEV')
  async deletePartner(@Param('id') id: string) {
    try {
      await this.partnersService.deletePartner(id);
      return {
        success: true,
        message: 'Partenaire supprimé avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

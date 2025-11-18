import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupérer tous les partenaires
   */
  async getAllPartners() {
    return this.prisma.partner.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Récupérer un partenaire par ID
   */
  async getPartnerById(id: string) {
    return this.prisma.partner.findUnique({ where: { id } });
  }

  /**
   * Créer un nouveau partenaire
   */
  async createPartner(data: any) {
    const { name, description, image, websiteUrl, promoCode, promotionalText, order } = data;

    // Validation
    if (!name || !description) {
      throw new BadRequestException('Le nom et la description sont obligatoires');
    }

    // Vérifier si le partenaire existe déjà
    const existingPartner = await this.prisma.partner.findUnique({
      where: { name },
    });

    if (existingPartner) {
      throw new BadRequestException('Ce partenaire existe déjà');
    }

    // Créer le partenaire
    return this.prisma.partner.create({
      data: {
        name,
        description,
        image: image || null,
        websiteUrl: websiteUrl || null,
        promoCode: promoCode || null,
        promotionalText: promotionalText || null,
        order: order || 0,
      },
    });
  }

  /**
   * Mettre à jour un partenaire
   */
  async updatePartner(id: string, data: any) {
    const { name, description, image, websiteUrl, promoCode, promotionalText, order } = data;

    // Vérifier que le partenaire existe
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new BadRequestException('Partenaire non trouvé');
    }

    // Vérifier que le nouveau nom n'existe pas ailleurs
    if (name && name !== partner.name) {
      const existingPartner = await this.prisma.partner.findUnique({
        where: { name },
      });
      if (existingPartner) {
        throw new BadRequestException('Ce nom de partenaire est déjà utilisé');
      }
    }

    // Mettre à jour le partenaire
    return this.prisma.partner.update({
      where: { id },
      data: {
        name: name || partner.name,
        description: description || partner.description,
        image: image !== undefined ? image : partner.image,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : partner.websiteUrl,
        promoCode: promoCode !== undefined ? promoCode : partner.promoCode,
        promotionalText: promotionalText !== undefined ? promotionalText : partner.promotionalText,
        order: order !== undefined ? order : partner.order,
      },
    });
  }

  /**
   * Supprimer un partenaire
   */
  async deletePartner(id: string) {
    // Vérifier que le partenaire existe
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new BadRequestException('Partenaire non trouvé');
    }

    // Supprimer le partenaire
    return this.prisma.partner.delete({
      where: { id },
    });
  }
}

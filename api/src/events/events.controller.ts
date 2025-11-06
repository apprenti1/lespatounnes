import { Controller, Get, Post, Patch, Delete, Param, HttpException, HttpStatus, Body, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  /**
   * GET /events
   * Récupère tous les événements
   */
  @Get()
  async findAll() {
    try {
      const events = await this.eventsService.findAll();
      return {
        success: true,
        data: events,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * POST /events
   * Crée un nouvel événement (admin uniquement)
   */
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createEventDto: any) {
    try {
      const event = await this.eventsService.create(createEventDto);
      return {
        success: true,
        data: event,
        message: 'Événement créé avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PATCH /events/:id
   * Modifie un événement existant (admin uniquement)
   */
  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateEventDto: any) {
    try {
      const event = await this.eventsService.update(id, updateEventDto);
      return {
        success: true,
        data: event,
        message: 'Événement modifié avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * DELETE /events/:id
   * Supprime un événement (admin uniquement)
   */
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    try {
      await this.eventsService.delete(id);
      return {
        success: true,
        message: 'Événement supprimé avec succès',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * GET /events/:id
   * Récupère un événement spécifique avec ses photos
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const event = await this.eventsService.findOne(id);

      if (!event) {
        throw new HttpException('Événement non trouvé', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: event,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

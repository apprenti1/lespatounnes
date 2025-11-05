import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';

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

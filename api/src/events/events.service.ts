import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        lieu: true,
        date: true,
        recurrence: true,
        onlyUsers: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.event.findUnique({
      where: { id },
      include: {
        photos: true,
      },
    });
  }
}

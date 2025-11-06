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
        image: true,
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

  async create(data: any) {
    return await this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description || '',
        image: data.image || null,
        lieu: data.lieu || '',
        date: new Date(data.date),
        recurrence: data.recurrence || null,
        onlyUsers: data.onlyUsers || false,
      },
    });
  }

  async update(id: string, data: any) {
    return await this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || '',
        image: data.image || null,
        lieu: data.lieu || '',
        date: new Date(data.date),
        recurrence: data.recurrence || null,
        onlyUsers: data.onlyUsers || false,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.event.delete({
      where: { id },
    });
  }
}

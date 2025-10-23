import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HelloAssoService } from './helloasso.service';

@Controller('helloasso')
export class HelloAssoController {
  constructor(private readonly helloAssoService: HelloAssoService) {}

  @Post('create-membership-checkout')
  async createMembershipCheckout(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      amount: number;
    },
  ) {
    return this.helloAssoService.createMembershipCheckout(body);
  }

  @Get('check-payment')
  async checkPayment(@Query('checkoutId') checkoutId: string) {
    return this.helloAssoService.checkPaymentStatus(checkoutId);
  }
}

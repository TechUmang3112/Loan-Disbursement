// Imports
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../dto/createPayment.dto';
import { Controller, Post, Body, Query } from '@nestjs/common';

@Controller('user')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }
}

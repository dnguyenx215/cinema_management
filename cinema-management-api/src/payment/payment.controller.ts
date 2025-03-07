import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-url')
  async createPaymentUrl(
    @Body() body: { amount: number; orderDescription: string; orderType: string; bankCode: string; language: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { amount, orderDescription, orderType, bankCode, language } = body;
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket?.remoteAddress ||
      '127.0.0.1';

    const paymentUrl = await this.paymentService.createPaymentUrl(
      amount,
      orderDescription,
      orderType,
      bankCode,
      language,
      ipAddr as string,
    );

    return res.redirect(paymentUrl);
  }
}

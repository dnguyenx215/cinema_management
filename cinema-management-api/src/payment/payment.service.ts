import { Injectable } from '@nestjs/common';
import * as qs from 'querystring';
import * as moment from 'moment';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  // Địa chỉ URL của VNPAY
  private readonly vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  // Mã bí mật (HashSecret) dùng để tạo chữ ký bảo mật
  private readonly secretKey = 'B4D4Y01C4ED8USSGOOR3QWPB1DREB8WT';
  // Mã website tại VNPAY (TmnCode)
  private readonly vnpTmnCode = 'H2OTT65M';
  // Địa chỉ trả về sau khi thanh toán
  private readonly returnUrl = 'http://localhost:4200/paid';

  async createPaymentUrl(
    amount: number,
    orderDescription: string,
    orderType: string,
    bankCode: string,
    language: string,
    ipAddr: string,
  ): Promise<string> {
    // Lấy thời gian hiện tại theo định dạng YYYYMMDDHHmmss
    const createDate = moment().format('YYYYMMDDHHmmss');
    // Sử dụng HHmmss làm mã đơn hàng (TxnRef)
    const orderId = moment().format('HHmmss');

    const locale = language || 'vn';
    const currCode = 'VND';

    // Tạo các tham số theo định dạng yêu cầu của VNPAY
    let vnp_Params: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnpTmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100, // VNPAY yêu cầu nhân 100 với số tiền
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp các key theo thứ tự từ điển (giống ksort trong PHP)
    const sortedKeys = Object.keys(vnp_Params).sort();
    // Tạo chuỗi ký tự cần ký: key1=value1&key2=value2...
    const signData = sortedKeys
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(vnp_Params[key])}`)
      .join('&');

    // Tạo chữ ký với thuật toán SHA512
    const hmac = crypto.createHmac('sha512', this.secretKey);
    const secureHash = hmac.update(signData, 'utf-8').digest('hex');

    // Thêm chữ ký vào các tham số
    vnp_Params['vnp_SecureHash'] = secureHash;

    // Tạo URL thanh toán bằng cách nối chuỗi các tham số đã được mã hoá
    const paymentUrl = `${this.vnpUrl}?${qs.stringify(vnp_Params)}`;
    
    return paymentUrl;
  }
}

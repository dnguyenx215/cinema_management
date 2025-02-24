import { Voucher } from "../voucher-management/voucher.interface";

export interface Ticket {
  id?: number;
  scheduleId: number;
  customerId: number;
  seatNumber: string;
  price: number;
  status: string; // 'booked', 'canceled', 'used'
  voucher?: Voucher;
}

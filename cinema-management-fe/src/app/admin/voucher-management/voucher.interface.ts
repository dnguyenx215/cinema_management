export interface Voucher {
    id?: number;
    code: string;
    discount: number;
    expirationDate: string; // ISO string
    isActive: boolean;
  }
  
export type WebOrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
  | "PROCESSED"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface WebOrder {
  id: string;
  orderNumber: string;
  totalAmount: string | number;
  status: WebOrderStatus;
  createdAt: string;
  canceledReason?: string | null;
  items?: any[];
}

export interface MidtransResult {
  order_id: string;
  transaction_id: string;
  transaction_status: string;
  status_code: string;
  status_message: string;
  payment_type: string;
  gross_amount: string;
  fraud_status?: string;
  [key: string]: string | number | boolean | object | undefined | null;
}

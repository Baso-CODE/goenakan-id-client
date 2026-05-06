import { MidtransResult } from "./midtransResult.type";

// 2. Definisikan struktur opsi callback Snap
export interface SnapOptions {
  onSuccess?: (result: MidtransResult) => void;
  onPending?: (result: MidtransResult) => void;
  onError?: (result: MidtransResult) => void;
  onClose?: () => void;
}

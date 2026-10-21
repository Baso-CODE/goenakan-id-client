import type { SnapOptions } from "./snapOptions.type";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: SnapOptions) => void;
    };
  }
}

export {};

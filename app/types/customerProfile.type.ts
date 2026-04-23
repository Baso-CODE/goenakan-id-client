// src/app/types/customerProfile.type.ts

export type AccountType = "INDIVIDUAL" | "CORPORATE";

export interface CustomerProfile {
  id: string;
  userId: string;
  accountType: AccountType;
  phone?: string | null;
  // Fields Corporate
  picName?: string | null;
  picPhone?: string | null;
  companyName?: string | null;
  department?: string | null;
  avatarUrl?: string | null;

  // Data User yang di-include
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string; // Untuk update tabel User
  phone?: string;
  picName?: string;
  picPhone?: string;
  companyName?: string;
  department?: string;
  avatarUrl?: string;
}

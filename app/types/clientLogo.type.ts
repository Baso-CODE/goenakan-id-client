export interface ClientLogo {
  id: string;
  name: string;
  imageUrl: string;
  imagePublicId: string;
  altText?: string | null;
  websiteUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

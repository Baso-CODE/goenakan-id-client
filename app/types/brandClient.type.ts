export interface BrandClient {
  id: string;
  name: string;
  slug: string;
  country: string;
  logo: string;
  logoId: string;
  websiteUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
}

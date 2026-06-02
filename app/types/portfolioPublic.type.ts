export interface PortfolioPublic {
  id: string;
  title: string;
  slug: string;
  clientName: string; // Nama PT/Perusahaan
  image: string;
  imageId?: string;
  description?: string | null;

  // ✨ Field detail untuk kebutuhan children
  orderQuantity: number;
  projectDate: string | null;
  displayOrder?: number;
  isActive?: boolean;

  // ✨ Field opsional untuk relasi kembali ke kategori (jika diperlukan)
  eventCategoryId?: string | null;
  eventCategory?: {
    id: string;
    title: string;
  };
}

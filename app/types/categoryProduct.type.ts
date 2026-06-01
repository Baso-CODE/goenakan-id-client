export interface CategoryPublic {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  description?: string;

  itemCategories?: {
    id: string;
    name: string;
  }[];
}

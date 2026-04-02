export interface Product {
  id: string;
  name: string;
  regularPrice: number;
  bulkPrice: number;
  minOrder: number;
  sold: number;
  image: string;
  category: string;
  color: string;
  size: string;
  availability: "in_stock" | "out_of_stock";
}

export interface FilterState {
  category: string;
  color: string;
  size: string;
  price: string;
  availability: string;
  sort: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

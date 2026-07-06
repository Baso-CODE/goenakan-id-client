export type MediaType = "image" | "video";

export interface MockupArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  description?: string;
  physicalWidth?: number;
  physicalHeight?: number;
  unit?: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  mockupAreas?: MockupArea[];
  attributeValueId?: string | null;
  altText?: string | null;
  mockupSideName?: string | null;
  printPositionValueId?: string | null;
}

export interface AttributeDisplay {
  name: string;
  value: string;
  type?: string;
  parentValueId?: string | null;
  attributeValueId?: string | null;
}

export interface PriceTier {
  label: string;
  subtitle?: string;
  pricePerPcs: number;
  minQty: number;
  maxQty: number | null;
  badge?: string;
}

export interface ProductVariantDisplay {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  images: MediaItem[];
  attributes: AttributeDisplay[];

  priceTiers?: PriceTier[];
  stock: number;

  rawWeight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;

  weightString: string;
  dimensionsString: string;
}

export interface ProductDetail {
  id: string;
  sku: string;
  category: string;
  name: string;
  basePrice: number;
  sold: number;
  media: MediaItem[];
  variants?: ProductVariantDisplay[];
  priceTiers: PriceTier[];
  description: string;
  stock: number;

  weight: string;
  dimensions: string;
  accessories: string[];
  whatsappNumber: string;

  materialType?: string | null;
  rawWeight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
  isCustom?: boolean;
  isMadeByOrder?: boolean;
  isMultiFace?: boolean;
  mockupFrontImageId?: string | null;
  mockupBackImageId?: string | null;
  attributeValues?: ProductAttributeValueDetail[];
}

export interface ProductAttributeValueDetail {
  id: string;
  attributeId: string;
  attributeValueId: string;
  priceModifier: number;
  value: string;
  attributeName: string;
  attributeType?: string;
  parentValueId?: string | null;
}

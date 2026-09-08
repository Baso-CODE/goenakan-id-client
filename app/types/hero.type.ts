export interface HeroSlidePublic {
  id: string;
  title: string;
  imageUrl: string;
  imageMobileUrl: string;
  imageTabletUrl?: string | null;
  altText?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  displayOrder: number;
}

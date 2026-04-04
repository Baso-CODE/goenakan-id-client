export interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface FaqPageProps {
  title?: string;
  faqs?: FaqItem[];
}

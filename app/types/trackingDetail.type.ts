export interface TrackingStep {
  label: string;
  location: string;
  date: string;
  done: boolean;
}

export interface OrderResultItem {
  id: number;
  name: string;
  image: string;
  dimensions: string;
  weight: string;
  color: string;
  material: string;
  quantity: number;
  price: number;
}

export interface OrderTrackingResultProps {
  orderId: string;
  createdDate: string;
  status: "Paid" | "Pending" | "Cancelled";
  items: OrderResultItem[];
  subtotal: number;
  shipping: number;
  trackingSteps: TrackingStep[];
  onClose?: () => void;
}

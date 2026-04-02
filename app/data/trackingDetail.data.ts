import { OrderTrackingResultProps } from "../types/trackingDetail.type";

// DUMMY DATA untuk preview
export const DUMMY_ORDER_RESULT: OrderTrackingResultProps = {
  orderId: "#GI2192091029",
  createdDate: "14 Maret, 2026 at 10:45 AM",
  status: "Paid",
  items: [
    {
      id: 1,
      name: "Bamboo Pen",
      image: "/images/products/demo-products.png",
      dimensions: "7.5 × 12 cm",
      weight: "5 kg",
      color: "Coklat",
      material: "Bamboo",
      quantity: 2,
      price: 10000,
    },
    {
      id: 2,
      name: "Bamboo Pen",
      image: "/images/products/demo-products.png",
      dimensions: "7.5 × 12 cm",
      weight: "5 kg",
      color: "Coklat",
      material: "Bamboo",
      quantity: 2,
      price: 10000,
    },
  ],
  subtotal: 20000,
  shipping: 20000,
  trackingSteps: [
    {
      label: "Package Confirmed",
      location: "Surabaya, Jawa Timur",
      date: "14 Mar, 2026",
      done: true,
    },
    {
      label: "In Transit With Carrier",
      location: "Surabaya, Jawa Timur",
      date: "14 Mar, 2026",
      done: true,
    },
    {
      label: "Arrived at Local Depot",
      location: "Cipete, Jakarta",
      date: "16 Mar, 2026",
      done: true,
    },
    {
      label: "In Delivery to Destination",
      location: "Cipete, Jakarta",
      date: "16 Mar, 2026",
      done: true,
    },
  ],
};

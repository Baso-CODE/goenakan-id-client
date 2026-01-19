"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Data Pertanyaan & Jawaban
const faqs = [
  {
    id: "item-1",
    question: "What is the Minimum Order Quantity (MOQ)?",
    answer:
      "Our MOQ varies depending on the product type. Generally, for custom logo items, the MOQ starts from 50 pieces. However, for fully custom-shaped products, it might start from 100-500 pieces. Please contact us for details.",
  },
  {
    id: "item-2",
    question: "How long does the production process take?",
    answer:
      "Standard production time is approximately 7-14 working days after the design mock-up is approved. For larger orders or complex custom items, it may take 3-4 weeks. We also offer rush services for urgent needs.",
  },
  {
    id: "item-3",
    question: "Do you provide design services?",
    answer:
      "Yes! We have a dedicated in-house design team that can help you create or refine your design layout, logo placement, and packaging design free of charge for confirmed orders.",
  },
  {
    id: "item-4",
    question: "Can I request a sample before mass production?",
    answer:
      "Absolutely. We highly recommend ordering a sample to ensure the material and print quality meet your expectations. Sample fees may apply but are often deductible from the final bulk order invoice.",
  },
  {
    id: "item-5",
    question: "Do you ship internationally?",
    answer:
      "Yes, Goenakan Indonesia ships worldwide. We work with reliable logistics partners to ensure your products arrive safely and on time, wherever you are located.",
  },
];

export default function Faq() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl  text-gray-900 uppercase tracking-wide mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">
            Everything you need to know about our products and services.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:text-[#C4A48E] py-6 hover:no-underline transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-500 leading-relaxed pb-6 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Factory,
  MessageCircle,
  PenTool,
  Truck,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Consultation",
    description:
      "Discuss your ideas, needs, and budget with our team to find the best solution.",
    icon: MessageCircle,
  },
  {
    id: "02",
    title: "Design & Sample",
    description:
      "We create a mockup or sample for your approval before mass production starts.",
    icon: PenTool,
  },
  {
    id: "03",
    title: "Production",
    description:
      "Our skilled craftsmen bring your custom products to life with high attention to detail.",
    icon: Factory,
  },
  {
    id: "04",
    title: "Delivery",
    description:
      "Your custom products are safely packed and shipped to your doorstep or event location.",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl  text-gray-900 uppercase tracking-wide mb-4">
            How to Order
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Simple steps to create your own custom products with Goenakan
            Indonesia.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              <Card className="border-none shadow-none bg-transparent flex flex-col items-center text-center h-full">
                <CardContent className="p-0 flex flex-col items-center">
                  {/* Icon Wrapper dengan Nomor */}
                  <div className="relative mb-6">
                    {/* Lingkaran Icon */}
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-[#C4A48E]" />
                    </div>

                    {/* Badge Nomor Kecil */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold ">
                      {step.id}
                    </div>
                  </div>

                  {/* Konten Teks */}
                  <h3 className="text-xl font-bold  text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Panah Penghubung (Hanya muncul di Desktop & bukan di item terakhir) */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-4 transform translate-x-1/2 text-gray-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

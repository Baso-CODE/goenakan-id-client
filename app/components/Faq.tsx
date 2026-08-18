import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLocale, getTranslations } from "next-intl/server";
import { getLandingFaqs } from "../api/faq/getFaqLandingPage.api";

export const dynamic = "force-dynamic";

export default async function Faq() {
  const faqs = await getLandingFaqs();

  const locale = await getLocale();
  const t = await getTranslations("Faq");

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="container max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>

        {/* Accordion Component */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => {
            const question =
              locale === "id"
                ? faq.questionId || faq.questionEn
                : faq.questionEn || faq.questionId;

            const answer =
              locale === "id"
                ? faq.answerId || faq.answerEn || ""
                : faq.answerEn || faq.answerId || "";

            return (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:text-[#C4A48E] py-6 hover:no-underline transition-colors">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed pb-6 text-base">
                  <div
                    className="prose prose-sm max-w-none prose-stone"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}

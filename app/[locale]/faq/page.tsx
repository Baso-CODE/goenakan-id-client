import { getMainFaqs } from "@/app/api/faq/getFaqPage.api";
import { FaqPage } from "@/app/components/faq/faqPage";

export const dynamic = "force-dynamic";

export default async function FaqRoutePage() {
  const faqs = await getMainFaqs();

  return (
    <main>
      <FaqPage title="Frequently Asked Questions" faqs={faqs} />
    </main>
  );
}

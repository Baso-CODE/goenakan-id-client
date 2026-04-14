import { getMainFaqs } from "../api/faq/getFaqPage.api";
import { FaqPage } from "../components/faq/faqPage";

export const dynamic = "force-dynamic";

export default async function FaqRoutePage() {
  const faqs = await getMainFaqs();
  console.log("in adalah data faqs", faqs);

  return (
    <main>
      <FaqPage title="Frequently Asked Questions" faqs={faqs} />
    </main>
  );
}

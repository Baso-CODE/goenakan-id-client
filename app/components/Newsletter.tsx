import { getTranslations } from "next-intl/server";
import NewsletterForm from "./newsletterForm";

export default async function Newsletter() {
  const t = await getTranslations("Newsletter");

  return (
    <section
      className="
        w-full
        py-24
        bg-white
        border-t
        border-gray-100
        [content-visibility:auto]
        [contain-intrinsic-size:auto_500px]
      ">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-6 max-w-lg">
              {t("headline")}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              {t("subheadline")}
            </p>
          </div>

          <NewsletterForm
            placeholder={t("placeholder")}
            terms={t("terms")}
            buttonText={t("button")}
          />
        </div>
      </div>
    </section>
  );
}

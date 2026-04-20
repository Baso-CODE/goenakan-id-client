import { ContactForm } from "@/app/components/contact/contactForm";
import { LocationMap } from "@/app/components/contact/locationMap";

export default function ContactPage() {
  return (
    <>
      <ContactForm />
      <LocationMap height="500px" />
    </>
  );
}

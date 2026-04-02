import { ContactForm } from "../components/contact/contactForm";
import { LocationMap } from "../components/contact/locationMap";

export default function ContactPage() {
  return (
    <>
      <ContactForm />
      <LocationMap height="500px" />
    </>
  );
}

import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Contact MBPP | Get in Touch",
  description: "Have questions about a property, partnership opportunities, or need support? Contact MBPP in Kano today.",
  alternates: { canonical: "https://mbpproperties.com/contact" },
};

export default function ContactPage() {
  return <PageComponent />;
}

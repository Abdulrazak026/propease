import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Custom Property Order | MBPP",
  description: "Tell us what property you need and we'll find it for you. Submit a custom order and an MBPP ambassador will follow up within 48 hours.",
  alternates: { canonical: "https://mbpproperties.com/custom-order" },
};

export default function CustomOrderPage() {
  return <PageComponent />;
}

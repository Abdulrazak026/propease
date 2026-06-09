import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Fair Housing Guide | MBPP Properties",
  description: "Learn about MBPP's commitment to equal housing opportunity and how we prevent discrimination in Kano State.",
  alternates: { canonical: "https://mbpproperties.com/fair-housing" },
};

export default function FairHousingPage() {
  return <PageComponent />;
}

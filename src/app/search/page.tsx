import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Search Properties in Kano & Northern States | Buy & Rent | MBPP",
  description: "Browse verified properties for sale and rent across Kano & Northern States. Filter by location, price, property type, and more.",
  alternates: { canonical: "https://mbpproperties.com/search" },
};

export default function SearchPage() {
  return <PageComponent />;
}

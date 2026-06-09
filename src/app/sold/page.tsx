import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Recently Sold Properties in Kano | MBPP",
  description: "See real properties that have been sold through MBPP in Kano. Updated weekly with actual transaction data.",
  alternates: { canonical: "https://mbpproperties.com/sold" },
};

export default function SoldPage() {
  return <PageComponent />;
}

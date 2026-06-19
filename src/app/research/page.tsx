import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Northern Nigeria Real Estate Market Research | MBPP",
  description: "Data-driven insights into the Northern Nigeria real estate market, powered by MBPP transaction data and local surveys.",
  alternates: { canonical: "https://mbpproperties.com/research" },
};

export default function ResearchPage() {
  return <PageComponent />;
}

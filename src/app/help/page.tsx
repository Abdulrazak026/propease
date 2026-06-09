import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Help & Support | MBPP FAQ",
  description: "Search 60+ articles on buying, renting, and selling property in Kano. Browse common topics or message the MBPP team.",
  alternates: { canonical: "https://mbpproperties.com/help" },
};

export default function HelpPage() {
  return <PageComponent />;
}

import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "Careers at MBPP | Join Our Team in Kano",
  description: "Join the MBPP team and help build the future of property in Kano. See open roles and apply today.",
  alternates: { canonical: "https://mbpproperties.com/careers" },
};

export default function CareersPage() {
  return <PageComponent />;
}

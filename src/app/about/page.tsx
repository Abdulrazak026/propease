import type { Metadata } from "next";
import PageComponent from "./PageComponent";

export const metadata: Metadata = {
  title: "About MBPP | Our Story & Team in Kano",
  description: "MBPP is a Kano-based property company helping people buy, rent, and sell properties since 2017. Meet our team and learn how we work.",
  alternates: { canonical: "https://mbpproperties.com/about" },
};

export default function AboutPage() {
  return <PageComponent />;
}

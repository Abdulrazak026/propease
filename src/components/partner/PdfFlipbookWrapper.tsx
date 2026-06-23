"use client";
import dynamic from "next/dynamic";

const PdfFlipbook = dynamic(() => import("./PdfFlipbook"), { ssr: false });

export default function PdfFlipbookWrapper({ url }: { url: string }) {
  return <PdfFlipbook url={url} />;
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for this website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage title="Terms" {...terms} />;
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How personal data submitted through this website is used and protected.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" {...privacyPolicy} />;
}

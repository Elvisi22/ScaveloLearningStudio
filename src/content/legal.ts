/**
 * Privacy policy and terms. These are starting templates written for an
 * application-only website (no accounts, no payments, no database) whose form
 * submissions are delivered to a private Slack channel. Have them reviewed by
 * a legal professional and complete the bracketed details before launch.
 */

export type LegalSection = { heading: string; paragraphs: string[] };

export const privacyPolicy = {
  updated: "6 November 2026",
  intro:
    "This policy explains what personal data Scavelo Learning Studio collects through this website, why, and the rights you have. We collect as little as possible and never sell your data.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "The data controller is [Legal name of the business], [registered address], [VAT / company number]. You can contact us about privacy at any time at [privacy contact email].",
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "This website has no user accounts. We only collect the information you choose to send through the application and contact forms: your name, email address and, if you provide them, phone number, country, time zone, learning preferences, availability and any message you write.",
        "Our hosting provider processes technical data such as your IP address in server logs to deliver the website securely and to prevent abuse. We do not use advertising or tracking cookies.",
      ],
    },
    {
      heading: "Why we use it",
      paragraphs: [
        "We use your information only to review your application or message, to contact you about the programs you are interested in, and to arrange lessons if you decide to enroll.",
        "The legal basis is the steps you ask us to take before entering into an agreement with us (Art. 6(1)(b) GDPR) and, for anti-abuse measures, our legitimate interest in keeping the website secure (Art. 6(1)(f) GDPR).",
      ],
    },
    {
      heading: "Where your data goes",
      paragraphs: [
        "Form submissions are not stored in a website database. They are delivered directly to a private Slack workspace used by the instructor (Slack Technologies, LLC, a Salesforce company) and, if email confirmation is enabled, sent through our email provider [e.g. Resend, Inc.].",
        "These providers act as processors on our behalf and may process data outside the European Economic Area under appropriate safeguards such as the EU Standard Contractual Clauses.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "If you do not become a student, we delete your application within [12] months of our last contact. If you enroll, we keep the information needed to provide your lessons for as long as you are a student and as required by law afterwards.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask to access, correct, delete or export your data, object to its processing, or withdraw consent at any time by emailing [privacy contact email]. You also have the right to lodge a complaint with your local data protection authority — in Albania, the Information and Data Protection Commissioner (IDP). Residents of US states with privacy laws may have additional rights under those laws.",
      ],
    },
  ] satisfies LegalSection[],
};

export const terms = {
  updated: "6 November 2026",
  intro: "These terms apply to your use of this website. Lesson-specific terms are agreed personally before enrollment.",
  sections: [
    {
      heading: "About this website",
      paragraphs: [
        "This website presents the programs offered by [Legal name of the business] and lets you apply or get in touch. It does not create accounts, take bookings or process payments.",
      ],
    },
    {
      heading: "Applications are non-binding",
      paragraphs: [
        "Submitting an application does not create an agreement or reserve a place. Enrollment, scheduling and pricing are confirmed personally by the instructor in writing, and you are free to decline at any point before confirming.",
      ],
    },
    {
      heading: "Prices and availability",
      paragraphs: [
        "Prices shown on this website are indicative and may change. Seat availability for group classes is updated manually and may not reflect the latest confirmations. The price and schedule confirmed to you in writing are the ones that apply.",
      ],
    },
    {
      heading: "Lesson materials",
      paragraphs: [
        "Presentations and resources shared during your program remain the intellectual property of [Legal name of the business] and are licensed to you for personal learning only. Please do not redistribute them without permission.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "We take care to keep this website accurate and available, but we cannot guarantee it will always be error-free. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the laws of [Albania / US state]. Contact: [contact email]."],
    },
  ] satisfies LegalSection[],
};

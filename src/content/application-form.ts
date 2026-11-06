/**
 * Application form configuration. Toggle optional fields, make them required,
 * or add your own questions — validation on the client and server follows this
 * file automatically.
 */

export type FieldSetting = { visible: boolean; required: boolean };

export type ExtraQuestion = {
  id: string;
  label: string;
  help?: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required: boolean;
  step: "interest" | "availability" | "details";
};

export const applicationForm = {
  intro:
    "Tell us a little about yourself. There's no account to create and nothing to pay at this stage — the instructor reviews every application personally and will contact you.",
  successTitle: "Thank you. Your application has been received.",
  successMessage:
    "The instructor reviews every application personally and will contact you within two business days using your preferred contact method.",
  privacyVersion: "2026-11-06",

  fields: {
    phone: { visible: true, required: false },
    country: { visible: true, required: true },
    preferredContact: { visible: true, required: true },
    level: { visible: true, required: true },
    objectives: { visible: true, required: true },
    experience: { visible: true, required: false },
    topics: { visible: true, required: false },
    availability: { visible: true, required: false },
    timezone: { visible: true, required: true },
    preferredStartDate: { visible: true, required: false },
    motivation: { visible: true, required: false },
    comments: { visible: true, required: false },
  } satisfies Record<string, FieldSetting>,

  extraQuestions: [
    {
      id: "referral",
      label: "How did you hear about Scavelo Learning Studio?",
      type: "select",
      options: ["Search engine", "LinkedIn", "Recommendation from a friend or colleague", "Event or talk", "Other"],
      required: false,
      step: "details",
    },
  ] as ExtraQuestion[],
};

export type ConfigurableField = keyof typeof applicationForm.fields;

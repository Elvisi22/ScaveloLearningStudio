import "server-only";

const value = (key: string) => {
  const raw = process.env[key];
  return raw && raw.trim() ? raw.trim() : undefined;
};

/** Server-side configuration. Integrations are only used when their credentials exist. */
export const serverEnv = {
  slackWebhookUrl: value("SLACK_WEBHOOK_URL"),
  resendApiKey: value("RESEND_API_KEY"),
  emailFrom: value("EMAIL_FROM"),
  instructorEmail: value("INSTRUCTOR_EMAIL"),
  turnstileSecret: value("TURNSTILE_SECRET_KEY"),
  turnstileSiteKey: value("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
  isProduction: process.env.NODE_ENV === "production",
};

export const integrations = {
  slack: Boolean(serverEnv.slackWebhookUrl),
  email: Boolean(serverEnv.resendApiKey && serverEnv.emailFrom),
  turnstile: Boolean(serverEnv.turnstileSecret && serverEnv.turnstileSiteKey),
};

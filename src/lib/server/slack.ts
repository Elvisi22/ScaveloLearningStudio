import "server-only";
import { applicationForm } from "@/content/application-form";
import { privatePackages } from "@/content/copy";
import { site } from "@/content/site";
import { getGroupClass, getProgram } from "@/lib/catalog";
import { CONTACT_METHODS, CONTACT_TOPICS, DAYS, FORMATS, INTENTS, LEVELS, TIMES, formatPhone, type Application } from "@/lib/validation";
import { serverEnv } from "./env";

type Block = Record<string, unknown>;

/** Escapes user input for Slack mrkdwn so it can't trigger mentions or links. */
function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clip(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function field(label: string, value: string | undefined | null) {
  return { type: "mrkdwn", text: clip(`*${label}*\n${value ? esc(value) : "—"}`, 1900) };
}

function longText(label: string, value: string) {
  if (!value) return null;
  return { type: "section", text: { type: "mrkdwn", text: clip(`*${label}*\n${esc(value)}`, 2900) } };
}

export type DeliveryResult = { ok: true; simulated: boolean } | { ok: false };

async function post(payload: { text: string; blocks: Block[] }, label: string): Promise<DeliveryResult> {
  if (!serverEnv.slackWebhookUrl) {
    if (serverEnv.isProduction) {
      console.error(`[slack] SLACK_WEBHOOK_URL is not configured — ${label} could not be delivered.`);
      return { ok: false };
    }
    console.info(`\n[slack:dev] SLACK_WEBHOOK_URL not set — ${label} printed here instead of being sent:\n${payload.text}\n${JSON.stringify(payload.blocks, null, 2)}\n`);
    return { ok: true, simulated: true };
  }
  try {
    const response = await fetch(serverEnv.slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, unfurl_links: false, unfurl_media: false }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`[slack] webhook responded ${response.status}: ${await response.text().catch(() => "")}`);
      return { ok: false };
    }
    return { ok: true, simulated: false };
  } catch (error) {
    console.error("[slack] webhook request failed", error);
    return { ok: false };
  }
}

export async function sendApplicationToSlack(application: Application, reference: string) {
  const program = getProgram(application.program);
  const programLabel = program?.title ?? "Not sure yet";
  const groupClass = application.classId ? getGroupClass(application.classId) : null;
  const pack = privatePackages.find((p) => p.id === application.package);
  const phone = formatPhone(application.phone, application.country);
  const countryName = application.country ? (new Intl.DisplayNames(["en"], { type: "region" }).of(application.country) ?? application.country) : "";
  const days = application.preferredDays.map((d) => DAYS[d]).join(", ");
  const time = application.preferredTime ? TIMES[application.preferredTime] : "";

  const extras = applicationForm.extraQuestions
    .map((q) => ({ label: q.label, value: application.extra[q.id] ?? "" }))
    .filter((q) => q.value);

  const blocks: Block[] = [
    { type: "header", text: { type: "plain_text", text: `New application · ${reference}`, emoji: false } },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${esc(application.fullName)}* — ${esc(INTENTS[application.intent])} · *${esc(programLabel)}* · ${esc(FORMATS[application.format])}`,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Email*\n<mailto:${encodeURIComponent(application.email).replace(/%40/g, "@")}|${esc(application.email)}>` },
        field("Phone", phone),
        field("Country", countryName),
        field("Preferred contact", application.preferredContact ? CONTACT_METHODS[application.preferredContact] : ""),
        field("Level", application.level ? LEVELS[application.level] : ""),
        field(application.format === "GROUP" ? "Group class" : "Package", groupClass?.name ?? pack?.name ?? ""),
      ],
    },
    {
      type: "section",
      fields: [
        field("Preferred days", days),
        field("Preferred time", time),
        field("Time zone", application.timezone),
        field("Preferred start", application.preferredStartDate),
      ],
    },
  ];

  for (const block of [
    longText("Learning objectives", application.objectives),
    longText("Previous experience", application.experience),
    longText("Topics of interest", application.topics),
    longText("Why this program", application.motivation),
    longText("Questions or comments", application.comments),
    ...extras.map((extra) => longText(extra.label, extra.value)),
  ]) {
    if (block) blocks.push(block);
  }

  blocks.push(
    { type: "divider" },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Submitted via ${esc(site.name)} website · privacy policy v${esc(applicationForm.privacyVersion)} accepted · No account or payment has been created.`,
        },
      ],
    },
  );

  const text = `New application ${reference} from ${application.fullName} — ${programLabel} (${FORMATS[application.format]})`;
  return post({ text, blocks: blocks.slice(0, 50) }, `application ${reference}`);
}

export async function sendContactToSlack(message: { name: string; email: string; topic: keyof typeof CONTACT_TOPICS; message: string }, reference: string) {
  const blocks: Block[] = [
    { type: "header", text: { type: "plain_text", text: `New message · ${reference}`, emoji: false } },
    {
      type: "section",
      fields: [
        field("From", message.name),
        { type: "mrkdwn", text: `*Email*\n<mailto:${encodeURIComponent(message.email).replace(/%40/g, "@")}|${esc(message.email)}>` },
        field("Topic", CONTACT_TOPICS[message.topic]),
      ],
    },
    { type: "section", text: { type: "mrkdwn", text: clip(esc(message.message), 2900) } },
  ];
  return post({ text: `New message ${reference} from ${message.name}: ${CONTACT_TOPICS[message.topic]}`, blocks }, `message ${reference}`);
}

import "server-only";
import { site } from "@/content/site";
import { serverEnv, integrations } from "./env";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function layout(title: string, paragraphs: string[]) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3a3833">${p}</p>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#faf8f4;padding:32px 16px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e5dfd5;border-radius:16px">
<tr><td style="padding:40px 40px 8px;font-size:20px;letter-spacing:-0.4px;color:#1d1d1f"><strong>${escapeHtml(site.wordmark.primary)}</strong> <span style="color:#6e6e73">${escapeHtml(site.wordmark.secondary)}</span></td></tr>
<tr><td style="padding:16px 40px 8px;font-size:22px;font-weight:600;letter-spacing:-0.4px;line-height:1.3;color:#1d1d1f">${escapeHtml(title)}</td></tr>
<tr><td style="padding:16px 40px 32px">${body}</td></tr>
</table>
<p style="font-size:12px;color:#9b958c;margin-top:24px">${escapeHtml(site.legalName)}${site.contact.email ? ` · ${escapeHtml(site.contact.email)}` : ""}</p>
</td></tr></table></body></html>`;
}

async function send(to: string, subject: string, html: string, text: string, replyTo?: string) {
  if (!integrations.email) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${serverEnv.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: serverEnv.emailFrom, to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) console.error(`[email] Resend responded ${response.status}: ${await response.text().catch(() => "")}`);
    return response.ok;
  } catch (error) {
    console.error("[email] request failed", error);
    return false;
  }
}

/** Acknowledgement to the applicant (only when an email provider is configured). */
export async function sendApplicationAcknowledgement({ to, name, reference, program }: { to: string; name: string; reference: string; program: string }) {
  const firstName = name.split(" ")[0] ?? name;
  const subject = `We've received your application — ${reference}`;
  const lines = [
    `Dear ${escapeHtml(firstName)},`,
    `Thank you for applying to <strong>${escapeHtml(program)}</strong>. Your application reference is <strong>${escapeHtml(reference)}</strong>.`,
    `The instructor reviews every application personally and will contact you ${escapeHtml(site.contact.responseTime)} to discuss the format, schedule and pricing that suit you best. Nothing has been booked or charged.`,
    `If you have questions in the meantime, simply reply to this email.`,
    `Warm regards,<br>${escapeHtml(site.name)}`,
  ];
  const text = lines.map((l) => l.replace(/<[^>]+>/g, "").replace(/<br>/g, "\n")).join("\n\n");
  const sent = await send(to, subject, layout("Your application has been received.", lines), text, serverEnv.instructorEmail);
  if (serverEnv.instructorEmail) {
    await send(serverEnv.instructorEmail, `New application ${reference} — ${name}`, layout(`New application ${reference}`, [`${escapeHtml(name)} applied for ${escapeHtml(program)}. Full details are in Slack.`]), `${name} applied for ${program}. Full details are in Slack.`, to);
  }
  return sent;
}

export async function sendContactAcknowledgement({ to, name, reference }: { to: string; name: string; reference: string }) {
  const firstName = name.split(" ")[0] ?? name;
  const lines = [
    `Dear ${escapeHtml(firstName)},`,
    `Thank you for your message (reference <strong>${escapeHtml(reference)}</strong>). We'll reply ${escapeHtml(site.contact.responseTime)}.`,
    `Warm regards,<br>${escapeHtml(site.name)}`,
  ];
  const text = lines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n\n");
  return send(to, `Thanks for getting in touch — ${reference}`, layout("We've received your message.", lines), text, serverEnv.instructorEmail);
}

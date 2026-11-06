/**
 * Where the application and contact forms send their submissions.
 *
 * The site is static, so submissions are posted from the browser to
 * NEXT_PUBLIC_FORM_ENDPOINT. Until that is configured (e.g. a small relay that
 * forwards to Slack — see README), the forms explain that online submissions
 * open soon instead of pretending to send.
 */
export type SubmitResult =
  | { ok: true; reference: string; emailSent: boolean }
  | { ok: false; message: string; errors?: Record<string, string> };

export type Envelope = { values: unknown; honeypot?: unknown; elapsedMs?: unknown; turnstileToken?: unknown };

export const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() ?? "";
export const formsConnected = formEndpoint.length > 0;

export const NOT_CONNECTED_MESSAGE = "Online submissions open soon. Thank you for your patience — please check back shortly.";

export async function deliver(kind: "application" | "contact", envelope: Envelope): Promise<SubmitResult> {
  if (!formsConnected) return { ok: false, message: NOT_CONNECTED_MESSAGE };
  try {
    const response = await fetch(formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind, ...envelope }),
    });
    const data = (await response.json().catch(() => ({}))) as Partial<{ reference: string; emailSent: boolean; message: string; errors: Record<string, string> }>;
    if (!response.ok) {
      return {
        ok: false,
        message: data.message ?? "We couldn't send your submission just now. Please try again in a few minutes.",
        errors: data.errors,
      };
    }
    return { ok: true, reference: data.reference ?? "", emailSent: Boolean(data.emailSent) };
  } catch {
    return { ok: false, message: "We couldn't reach the server. Please check your connection and try again." };
  }
}

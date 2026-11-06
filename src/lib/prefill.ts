import { privatePackages } from "@/content/copy";
import { getProgram, upcomingClasses } from "./catalog";
import { CONTACT_METHODS, FORMATS, INTENTS, type ApplicationValues } from "./validation";

/**
 * Reads ?program=…&format=…&intent=…&class=…&package=…&contact=… to pre-select
 * choices in the application form. Unknown values are ignored.
 */
export function prefillFromSearch(params: { get(name: string): string | null }): Partial<ApplicationValues> {
  const get = (key: string) => params.get(key) ?? "";
  const initial: Partial<ApplicationValues> = {};

  const program = getProgram(get("program"));
  if (program) initial.program = program.slug;

  const format = get("format").toUpperCase();
  if (format in FORMATS) initial.format = format;

  const intent = get("intent").toUpperCase();
  if (intent in INTENTS) initial.intent = intent;
  else if (program && !program.acceptingApplications) initial.intent = "INTEREST";

  const groupClass = upcomingClasses().find((c) => c.id === get("class") && (!program || c.programSlug === program.slug));
  if (groupClass) {
    initial.classId = groupClass.id;
    initial.program ??= groupClass.programSlug;
    initial.format ??= "GROUP";
  }

  const pack = privatePackages.find((p) => p.id === get("package"));
  if (pack) {
    initial.package = pack.id;
    initial.format ??= "PRIVATE";
  }

  const contact = get("contact").toUpperCase();
  if (contact in CONTACT_METHODS) initial.preferredContact = contact;

  return initial;
}

"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True after hydration; false during server rendering. */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

function detectRegion() {
  try {
    return new Intl.Locale(navigator.language).maximize().region ?? "";
  } catch {
    return "";
  }
}

/** Visitor's time zone and region, read from the browser (empty on the server). */
export function useBrowserLocale() {
  const timezone = useSyncExternalStore(noopSubscribe, detectTimezone, () => "");
  const region = useSyncExternalStore(noopSubscribe, detectRegion, () => "");
  return { timezone, region };
}

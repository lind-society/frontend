import * as React from "react";

/**
 * "Unpublished changes" used to show on every edit page the moment it opened:
 * the tabs copy the whole record into the draft store as soon as they mount, and
 * the banner treated any draft content as a pending change.
 *
 * Here a draft only counts as changed when it differs from the state it had
 * before the admin touched anything. That starting state ("baseline") follows the
 * draft while it settles and is frozen at the first keystroke or field change; it
 * is kept in the same tab session, so a draft restored after a reload is still
 * compared against it.
 */

const baselineKey = (store: string, id: string) => `${store}:baseline:${id}`;

const sortDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        const item = (value as Record<string, unknown>)[key];
        if (item !== undefined) acc[key] = sortDeep(item);
        return acc;
      }, {});
  }
  return value;
};

/** Stable text for a draft, without its `id` tag. */
const fingerprint = (draft: Record<string, unknown>) => {
  const { id: _id, ...rest } = draft; // eslint-disable-line @typescript-eslint/no-unused-vars
  return JSON.stringify(sortDeep(rest));
};

const hasContent = (draft: Record<string, unknown>) =>
  Object.entries(draft).some(([key, value]) => key !== "id" && Boolean(value));

const readStorage = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Same check for list pages, which only have the stored draft to look at. */
export const readDraftDirty = (store: string, id?: string): boolean => {
  if (!id) return false;

  try {
    const raw = readStorage(store);
    const draft = (raw ? JSON.parse(raw)?.state?.data : null) as Record<string, unknown> | null;
    if (!draft || draft.id !== id) return false;

    const baseline = readStorage(baselineKey(store, id));
    return baseline !== null ? fingerprint(draft) !== baseline : hasContent(draft);
  } catch {
    return false;
  }
};

export const clearDraftBaseline = (store: string, id?: string) => {
  if (!id) return;
  try {
    sessionStorage.removeItem(baselineKey(store, id));
  } catch {
    /* storage unavailable: nothing to clear */
  }
};

/** True only when the admin has changed something since opening this record. */
export const useEditDraftDirty = (store: string, id: string | undefined, draft: Record<string, unknown>) => {
  const isOwnDraft = Boolean(id) && draft.id === id;

  // The page's first render already needs the answer (the "restored" toast).
  const [baseline, setBaseline] = React.useState<string | null>(() => (id ? readStorage(baselineKey(store, id)) : null));
  const touched = React.useRef(false);
  // A draft that already differs from its saved baseline was carried over from earlier work.
  const restoredDirty = React.useRef<boolean>(
    Boolean(id) && baseline !== null && isOwnDraft && fingerprint(draft) !== baseline,
  );

  React.useEffect(() => {
    const markTouched = () => {
      touched.current = true;
    };
    const events = ["input", "change", "keydown"] as const;
    events.forEach((name) => document.addEventListener(name, markTouched, true));
    return () => events.forEach((name) => document.removeEventListener(name, markTouched, true));
  }, []);

  React.useEffect(() => {
    if (!id || !isOwnDraft) return;
    if (touched.current || restoredDirty.current) return;

    const next = fingerprint(draft);
    try {
      sessionStorage.setItem(baselineKey(store, id), next);
    } catch {
      /* storage unavailable: the banner then falls back to "any content" */
    }
    setBaseline(next);
  }, [draft, id, isOwnDraft, store]);

  // The draft was cleared (published or discarded): forget its baseline too.
  React.useEffect(() => {
    if (id && !isOwnDraft && baseline !== null) {
      clearDraftBaseline(store, id);
      setBaseline(null);
      touched.current = false;
      restoredDirty.current = false;
    }
  }, [baseline, id, isOwnDraft, store]);

  if (!isOwnDraft) return false;
  return baseline !== null ? fingerprint(draft) !== baseline : hasContent(draft);
};

import { formatTitleCase } from "./formatTitleCase";

// Tab names as the design labels them (Figma: Highlights, Amenities, Policies, Reviews).
// The route/hash keys stay the same, only the visible text changes.
const TAB_LABELS: Record<string, string> = {
  general: "Highlights",
  "service-features": "Amenities",
  "villa-policies": "Policies",
  review: "Reviews",
};

export const formatTabLabel = (tab: string) => TAB_LABELS[tab] ?? formatTitleCase(tab);

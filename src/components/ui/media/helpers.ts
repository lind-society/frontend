import { AdditionalItem } from "../../../types";
import { Field, Section } from "./types";

export const DEFAULT_SECTION_TITLES = ["Bedrooms", "Outdoor Areas", "Indoor Areas", "More Pictures"];

// Helper functions to create empty field
export const createEmptyField = (): Field => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  photos: [],
  photosURLView: [],
});

// Helper functions to initials section
export const createInitialSections = (titles: string[]): Section[] => {
  return titles.map((title) => ({
    title,
    field: [createEmptyField()],
  }));
};

// Helper function to compare arrays
export const arraysEqual = (a: string[], b: string[]) => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// Helper to compare additional sections (simplified comparison)
export const additionalEqual = (a: AdditionalItem[] = [], b: AdditionalItem[] = []) => {
  if (a.length !== b.length) return false;

  const serializeItem = (item: AdditionalItem) => `${item.type}-${item.name}-${item.description}-${JSON.stringify([...item.photos].sort())}`;

  const aSet = new Set(a.map(serializeItem));

  return b.every((item) => aSet.has(serializeItem(item)));
};

import { AdditionalItem } from "../../../types";
import { Field, Section } from "./types";

export const DEFAULT_SECTION_TITLES = ["Bedrooms", "Outdoor Areas", "Indoor Areas", "More Pictures"];

export const createEmptyField = (): Field => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  photos: [],
});

export const createInitialSections = (titles: string[]): Section[] => {
  return titles.map((title) => ({
    title,
    field: [createEmptyField()],
  }));
};

export const arraysEqual = (a: string[], b: string[]) => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const additionalEqual = (a: AdditionalItem[] = [], b: AdditionalItem[] = []) => {
  if (a.length !== b.length) return false;

  const serializeItem = (item: AdditionalItem) => `${item.type}-${item.name}-${item.description}-${JSON.stringify([...item.photos].sort())}`;

  const aSet = new Set(a.map(serializeItem));

  return b.every((item) => aSet.has(serializeItem(item)));
};

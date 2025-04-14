import { Facilities } from "../../../types";

export interface Facility {
  id: string;
  icon: { url: string; key: string };
  name: string;
  description: string;
  includeDescription: boolean;
}

export interface FeaturePersistedType {
  facilities: Facilities[];
}

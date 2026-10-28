import { Facilities } from "../../../types";

export interface Facility {
  id: string;
  // The backend's facility catalog allows an unset icon (`icon: Icon | null`
  // on the entity) — a facility can exist before anyone's assigned it one.
  icon: { url: string; key: string } | null;
  name: string;
  description: string;
  includeDescription: boolean;
}

export interface FeaturePersistedType {
  facilities: Facilities[];
}

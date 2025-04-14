import { AdditionalItem } from "../../../types";

// Types
export interface Field {
  id: string;
  name: string;
  description: string;
  photos: string[];
  photosURLView: string[];
}

export interface Section {
  title: string;
  field: Field[];
}

export interface MediaType {
  photos: string[];
  videos: string[];
  video360s: string[];
}

export interface FormStateType extends MediaType {
  additional: Section[];
}

export interface MediaPersistedType extends MediaType {
  additionals: AdditionalItem[];
}

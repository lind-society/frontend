import { PlaceNearby } from "../../../types";

export interface LocationFormState {
  address: string;
  postalCode: string;
  mapLink: string;
  country: string;
  state: string;
  city: string;
  placeNearby: PlaceNearby[];
  placeName: string;
  placeDistance: string;
}

export interface LocationPersistedType {
  name: string;
  address: string;
  postalCode: string;
  mapLink: string;
  country: string;
  state: string;
  city: string;
  placeNearby: PlaceNearby[];
}

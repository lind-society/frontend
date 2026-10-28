export type SearchEntityType = "villa" | "property" | "activity";

/**
 * A single hit from GET /search.
 *
 * The endpoint UNIONs `villas`, `properties` and `activities`, so it returns a
 * deliberately thin projection — no price, photos or rating. Use the per-type
 * list endpoints (`/villas?search=`, …) when the UI needs full records.
 */
export interface SearchEntity {
  id: string;
  name: string;
  secondaryName: string;
  highlight: string;
  country: string;
  city: string;
  state: string;
  isFavorite: string;
  /** discriminator derived from the source table */
  type: SearchEntityType;
}

/** Query params accepted by GET /search (combine with page/limit for pagination). */
export interface SearchQuery {
  name?: string;
  highlight?: string;
  country?: string;
  city?: string;
  state?: string;
  isFavorite?: boolean;
}

import { FaMinus } from "react-icons/fa";

import { PlaceNearby } from "../../../types";

export const PlaceNearbyItem = ({ place, index, onRemove }: { place: PlaceNearby; index: number; onRemove: (index: number) => void }) => (
  <span className="flex items-center justify-between w-full px-4 pb-4">
    <p>{place.name}</p>
    <p className="flex items-center gap-8">
      {place.distance} m
      <button type="button" onClick={() => onRemove(index)}>
        <FaMinus size={24} />
      </button>
    </p>
  </span>
);

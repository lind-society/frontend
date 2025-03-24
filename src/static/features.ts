export interface ItemFeature {
  id: string;
  title: string;
  free: boolean;
  price: string;
  currency: {
    label: string;
    value: string;
  } | null;
  hidden: boolean;
}

export interface Feature {
  id: string;
  name: string;
  icon: {
    key: string;
    url: string;
  };
  items: ItemFeature[];
  isEditing: boolean;
}

export const mainFeatures: Feature[] = [
  {
    id: crypto.randomUUID(),
    name: "Facilities",
    icon: { key: "mdi:office-building", url: "https://api.iconify.design/mdi/office-building.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Entertainment",
    icon: { key: "mdi:movie-outline", url: "https://api.iconify.design/mdi/movie-outline.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Sport",
    icon: { key: "mdi:soccer", url: "https://api.iconify.design/mdi/soccer.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Food & Beverage",
    icon: { key: "mdi:food", url: "https://api.iconify.design/mdi/food.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
];

export const otherFeatures: Feature[] = [
  {
    id: crypto.randomUUID(),
    name: "Kids",
    icon: { key: "mdi:baby-face-outline", url: "https://api.iconify.design/mdi/baby-face-outline.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Relaxation",
    icon: { key: "mdi:spa", url: "https://api.iconify.design/mdi/spa.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Transport & Access",
    icon: { key: "mdi:bus", url: "https://api.iconify.design/mdi/bus.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Pet Friendly",
    icon: { key: "mdi:paw", url: "https://api.iconify.design/mdi/paw.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Wellness",
    icon: { key: "mdi:heart-pulse", url: "https://api.iconify.design/mdi/heart-pulse.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Security",
    icon: { key: "mdi:shield-lock", url: "https://api.iconify.design/mdi/shield-lock.svg" },
    items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
    isEditing: false,
  },
];

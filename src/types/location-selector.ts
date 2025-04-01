import { OptionType } from "./option";

export interface LocationSelectorProps {
  selectedCountry: OptionType | null;
  selectedProvince: OptionType | null;
  selectedCity: OptionType | null;
  setSelectedCountry: (value: OptionType | null) => void;
  setSelectedProvince: (value: OptionType | null) => void;
  setSelectedCity: (value: OptionType | null) => void;
}

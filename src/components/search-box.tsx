import { IoMdSearch } from "react-icons/io";
import { SearchBoxProps } from "../types";

export const SearchBox = ({ value, onChange, onSearch, placeholder = "Search..." }: SearchBoxProps) => {
  return (
    <div className="flex items-stretch justify-center w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
        className="input-text !rounded-e-none"
      />
      <button type="button" onClick={onSearch} className="flex items-center justify-center h-10 text-light bg-primary w-14">
        <IoMdSearch size={25} />
      </button>
    </div>
  );
};

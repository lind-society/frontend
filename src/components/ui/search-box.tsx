import { IoMdSearch } from "react-icons/io";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

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
      <button type="button" onClick={onSearch} className="flex items-center justify-center h-10 text-light bg-primary w-14 rounded-e">
        <IoMdSearch size={25} />
      </button>
    </div>
  );
};

import { useToggleState } from "../hooks";

import { DropdownProps } from "../types";
import { FaCaretDown } from "react-icons/fa";

export const Dropdown = ({ parentClassName, className, data, handleFiltered, selectedValue }: DropdownProps) => {
  const [ref, popover, togglePopover] = useToggleState(false);

  const selected = data?.find((item) => item.value === selectedValue);

  return (
    <span ref={ref} className={`dropdown ${parentClassName ?? ""} ${popover ? "border-primary" : "border-gray"}`} onClick={togglePopover}>
      {selected?.display}
      <FaCaretDown size={20} className={`duration-300 absolute right-2 fill-dark ${popover && "rotate-180"}`} />
      {popover && (
        <div className={`popover ${className ?? ""}`}>
          {data?.map((item, index) => (
            <button key={index} onClick={() => handleFiltered(item.value)} className="w-full px-4 py-2 text-start hover:bg-gray/20">
              {item.display}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

export interface DropdownProps {
  parentClassName: string;
  className: string;
  data: {
    display: string;
    value: string;
  }[];
  selectedValue: string;
  handleFiltered: (value: string) => void;
}

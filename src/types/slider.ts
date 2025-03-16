export interface SliderProps {
  title: string;
  loading: boolean | undefined;
  totalPage: number;
  className: string;
  parentClassName: string;
  children: JSX.Element | JSX.Element[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}

import { HTMLAttributes, JSX } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: JSX.Element | JSX.Element[];
}

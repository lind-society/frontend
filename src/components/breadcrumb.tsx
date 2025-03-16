import { Link } from "react-router-dom";

import { BreadcrumbsProps } from "../types";

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <ol className="flex gap-x-1" aria-label="breadcrumbs">
      {items.map((item, index) => (
        <li key={item.path} className="flex items-center">
          {index !== 0 && <span className="mr-1 font-semibold text-gray">/</span>}
          {index === items.length - 1 ? (
            <span className="font-medium text-gray line-clamp-1">{item.name}</span>
          ) : (
            <Link to={item.path} className="font-medium duration-300 text-primary hover:text-primary/80">
              {item.name}
            </Link>
          )}
        </li>
      ))}
    </ol>
  );
};

import * as React from "react";

import { IoClose } from "react-icons/io5";

/**
 * A 360 tour is either an uploaded video file (served by our API) or a link to a
 * hosted tour page (Panoee, Kuula, Matterport, ...). The guest site plays files
 * as video and links in a frame.
 */
export const isTourLink = (url: string) => /^https?:\/\//i.test(url) && !url.includes("/storages/files/");

export const splitTours = (urls: string[]) => ({
  links: urls.filter(isTourLink),
  files: urls.filter((url) => !isTourLink(url)),
});

interface TourLinksProps {
  links: string[];
  onChange: (links: string[]) => void;
}

export const TourLinks: React.FC<TourLinksProps> = ({ links, onChange }) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");

  const add = () => {
    const url = value.trim();

    if (!/^https?:\/\/\S+$/i.test(url)) {
      setError("Enter a full link that starts with https://");
      return;
    }
    if (links.includes(url)) {
      setError("This link is already added.");
      return;
    }

    onChange([...links, url]);
    setValue("");
    setError("");
  };

  return (
    <div className="flex items-start gap-4">
      <label className="block pt-2 whitespace-nowrap min-w-60">360 Tour link</label>
      <div className="w-full space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="url"
            className="input-text"
            placeholder="https://… (Panoee, Kuula, Matterport)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <button type="button" className="btn-outline whitespace-nowrap" onClick={add}>
            Add link
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {links.length > 0 && (
          <ul className="space-y-1">
            {links.map((link) => (
              <li
                key={link}
                className="flex items-center justify-between gap-3 px-3 py-1.5 border rounded border-dark/20"
              >
                <a href={link} target="_blank" rel="noreferrer" className="truncate text-primary">
                  {link}
                </a>
                <button
                  type="button"
                  aria-label="Remove link"
                  onClick={() => onChange(links.filter((item) => item !== link))}
                >
                  <IoClose size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const formatKebabCase = (str: string) => {
  if (!str) {
    return "";
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

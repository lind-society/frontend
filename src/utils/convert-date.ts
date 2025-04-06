export const convertISOToString = (date: string) => {
  if (!date) return null;
  return new Date(date);
};

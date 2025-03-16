export const convertDate = (date: string) => {
  if (!date) return null;

  const dates = new Date(date);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const format = `${dates.getDate()} ${months[dates.getMonth()]} ${dates.getFullYear()}`;
  return format;
};

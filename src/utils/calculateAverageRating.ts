import { Review } from "../types";

export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
  return parseFloat((totalRating / reviews.length).toFixed(2)); // Rounded to 2 decimal places
};

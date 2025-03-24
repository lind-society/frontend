export const deleteCurrencyCode = (obj: any): any => {
  // Check if null or not an object
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    // Process each element in the array
    return obj.map((item) => deleteCurrencyCode(item));
  }

  // Create a new object without the currencyCode property
  const result: { [key: string]: any } = {};

  // Process all object properties recursively
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip currencyCode properties
      if (key !== "currencyCode") {
        result[key] = deleteCurrencyCode(obj[key]);
      }
    }
  }

  return result;
};

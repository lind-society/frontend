export const deleteKeysObject = (obj: any, keysToRemove: string[]): any => {
  // Check if null or not an object
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deleteKeysObject(item, keysToRemove));
  }

  // Create a new object without the specified keys
  const result: { [key: string]: any } = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip keys that need to be removed
      if (!keysToRemove.includes(key)) {
        result[key] = deleteKeysObject(obj[key], keysToRemove);
      }
    }
  }

  return result;
};

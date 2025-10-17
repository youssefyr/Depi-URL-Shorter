export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidShortCode = (code: string): boolean => {
  return /^[a-zA-Z0-9]{6,10}$/.test(code);
};
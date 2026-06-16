export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const isBlank = (value) => !String(value || '').trim();

export const isPositiveNumber = (value) => Number(value) > 0;

export const isNonNegativeNumber = (value) => value === '' || Number(value) >= 0;

export const hasValidPasswordLength = (password) => String(password || '').length >= 6;

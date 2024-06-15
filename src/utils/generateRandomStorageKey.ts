export function generateRandomStorageKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  const minLength = 8;
  const maxLength = 16;
  const keyLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let randomKey = "";
  for (let i = 0; i < keyLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomKey += chars[randomIndex];
  }
  return randomKey;
}

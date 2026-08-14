// app/utils/cookie.ts
export const getUserCountryFromCookie = (): string => {
  if (typeof document === "undefined") return "ID";
  const match = document.cookie.match(/(^|;)\s*USER_COUNTRY\s*=\s*([^;]+)/);
  return match ? match[2] : "ID";
};

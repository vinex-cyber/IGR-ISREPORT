// src/utils/branchCookie.ts

const COOKIE_NAME = "selected_branch";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

export function setBranchCookie(branch: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(branch)}`,
    "path=/",
    `max-age=${MAX_AGE}`,
    "SameSite=Strict",
  ].join("; ");
}

export function getBranchCookie(): string {
  if (typeof window === "undefined") return "";

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("selected_branch="));

  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : "";
}

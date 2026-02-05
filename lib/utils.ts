/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Cookie helpers
export function setCookie(
  name: string,
  value: string,
  options?: { maxAge?: number; path?: string; sameSite?: string },
) {
  const { maxAge, path = "/", sameSite = "Strict" } = options || {};
  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;
  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }
  if (typeof window !== "undefined") {
    window.document.cookie = cookieString;
  }
}

export function deleteCookie(name: string) {
  if (typeof window !== "undefined") {
    window.document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
  }
}

export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${window.document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) {
      return decodeURIComponent(part.split(";").shift() || "");
    }
  }
  return null;
}

export function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  userRole: string,
  userEmail: string,
  userName: string,
  rememberMe: boolean = false,
) {
  const maxAge = rememberMe ? 2592000 : undefined; // 30 days or session
  setCookie("accessToken", accessToken, { maxAge });
  setCookie("refreshToken", refreshToken, { maxAge });
  setCookie("userRole", userRole, { maxAge });
  setCookie("userEmail", userEmail, { maxAge });
  setCookie("userName", userName, { maxAge });
}

export function clearAuthCookies() {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("userRole");
  deleteCookie("userEmail");
  deleteCookie("userName");
}

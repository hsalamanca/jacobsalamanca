import { createHmac, timingSafeEqual } from "node:crypto";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const COOKIE = "studio_session";

function secret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "nightshift"
  );
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "nightshift";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSession() {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function sessionValid(token: string | undefined) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}

export function setSession(c: Context, token: string) {
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: Boolean(process.env.VERCEL),
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession(c: Context) {
  deleteCookie(c, COOKIE, { path: "/" });
}

export function readSession(c: Context) {
  return sessionValid(getCookie(c, COOKIE));
}

export function passwordOk(input: string) {
  const expected = adminPassword();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(a.length > b.length ? a.subarray(0, b.length) : Buffer.concat([a, Buffer.alloc(b.length - a.length)]), b);
    return false;
  }
  return timingSafeEqual(a, b);
}

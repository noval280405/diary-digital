const encoder = new TextEncoder();
const ITERATIONS = 120_000;

const toBase64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes));

const fromBase64 = (value: string) =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

export const createPinHash = async (pin: string) => {
  if (!/^\d{6}$/.test(pin)) throw new Error("PIN harus terdiri dari 6 angka.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    key,
    256,
  );
  return { hash: toBase64(new Uint8Array(bits)), salt: toBase64(salt) };
};

export const verifyPinHash = async (pin: string, hash?: string, salt?: string) => {
  if (!hash || !salt || !/^\d{6}$/.test(pin)) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromBase64(salt), iterations: ITERATIONS },
    key,
    256,
  );
  const actual = new Uint8Array(bits);
  const expected = fromBase64(hash);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  actual.forEach((byte, index) => { difference |= byte ^ expected[index]; });
  return difference === 0;
};

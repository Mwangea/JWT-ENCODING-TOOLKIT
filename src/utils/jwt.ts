import { JWTHeader, JWTPayload } from '../types/jwt';

export function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

export async function generateSignature(
  data: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );

  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureString = String.fromCharCode(...signatureArray);
  return base64UrlEncode(signatureString);
}

export async function createJWT(
  payload: JWTPayload,
  secret: string,
  expiresIn?: number
): Promise<string> {
  const header: JWTHeader = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const finalPayload = { ...payload };
  if (expiresIn) {
    finalPayload.exp = Math.floor(Date.now() / 1000) + expiresIn;
    finalPayload.iat = Math.floor(Date.now() / 1000);
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(finalPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = await generateSignature(data, secret);

  return `${data}.${signature}`;
}

export function decodeJWT(token: string): {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return { header, payload, signature };
  } catch {
    return null;
  }
}

export async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const data = `${parts[0]}.${parts[1]}`;
    const expectedSignature = await generateSignature(data, secret);

    return expectedSignature === parts[2];
  } catch {
    return false;
  }
}

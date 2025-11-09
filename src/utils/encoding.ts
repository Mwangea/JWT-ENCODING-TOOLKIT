export function encodeBase64(input: string): string {
  return btoa(input);
}

export function decodeBase64(input: string): string {
  try {
    return atob(input);
  } catch {
    return 'Invalid Base64 string';
  }
}

export function encodeBase64Url(input: string): string {
  const base64 = btoa(input);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeBase64Url(input: string): string {
  try {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  } catch {
    return 'Invalid Base64URL string';
  }
}

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function encodeBase32(input: string): string {
  let bits = '';
  for (let i = 0; i < input.length; i++) {
    const byte = input.charCodeAt(i);
    bits += byte.toString(2).padStart(8, '0');
  }

  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0');
    const index = parseInt(chunk, 2);
    result += base32Alphabet[index];
  }

  while (result.length % 8 !== 0) {
    result += '=';
  }

  return result;
}

export function decodeBase32(input: string): string {
  try {
    const cleanInput = input.replace(/=/g, '').toUpperCase();
    let bits = '';

    for (let i = 0; i < cleanInput.length; i++) {
      const index = base32Alphabet.indexOf(cleanInput[i]);
      if (index === -1) return 'Invalid Base32 string';
      bits += index.toString(2).padStart(5, '0');
    }

    let result = '';
    for (let i = 0; i < bits.length; i += 8) {
      if (bits.length - i < 8) break;
      const byte = bits.slice(i, i + 8);
      result += String.fromCharCode(parseInt(byte, 2));
    }

    return result;
  } catch {
    return 'Invalid Base32 string';
  }
}

export function encodeHex(input: string): string {
  return Array.from(input)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function decodeHex(input: string): string {
  try {
    const hex = input.replace(/\s/g, '');
    if (hex.length % 2 !== 0) return 'Invalid Hex string';

    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substr(i, 2), 16);
      if (isNaN(byte)) return 'Invalid Hex string';
      result += String.fromCharCode(byte);
    }
    return result;
  } catch {
    return 'Invalid Hex string';
  }
}

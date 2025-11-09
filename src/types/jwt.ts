export interface JWTHeader {
  alg: string;
  typ: string;
}

export interface JWTPayload {
  [key: string]: string | number | boolean;
}

export interface GeneratedToken {
  token: string;
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  expiresAt?: number;
}

export interface TokenHistory {
  id: string;
  token: string;
  token_type: 'access' | 'refresh';
  created_at: string;
}

export enum UserRole {
  admin = 'admin',
  user = 'user'
}

export type RequestInfo = {
  ip: string;
  ua: string;
  endpoint: string;
};

export type TokenPayload = {
  sub: string;
  iat: number;
  jti: string;
};

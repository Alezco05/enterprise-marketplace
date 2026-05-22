export interface JwtUserPayload {
  sub: string;
  email: string;
  roles: string[];
}

// Extendemos de forma segura la interfaz global de Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

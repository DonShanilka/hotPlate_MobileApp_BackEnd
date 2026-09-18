declare global {
  namespace Express {
    interface Request {
      customerId?: string;
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}

export {};
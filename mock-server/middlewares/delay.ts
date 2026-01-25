import type { Request, Response, NextFunction } from 'express';

// Simulate server side delay
export const delay = (req: Request, res: Response, next: NextFunction): void => {
  const randomOutcome = Math.random();
  if (randomOutcome < 0.01) {
    setTimeout(() => next(), Math.floor((Math.random() * 8000) + 100));
  } else {
    next();
  }
};

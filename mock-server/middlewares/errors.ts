import type { Request, Response, NextFunction } from 'express';

// Simulate server side errors
export const error = (req: Request, res: Response, next: NextFunction): Response | void => {
  const randomOutcome = Math.random();
  if (randomOutcome < 0.05 && !req.path.startsWith('/api/')) {
    const choice = Math.random();

    if (choice < 0.11) {
      return res.status(400).json({
        error: 'Bad Request',
      });
    } else if (choice < 0.22) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    } else if (choice < 0.33) {
      return res.status(403).json({
        error: 'Forbidden',
      });
    } else if (choice < 0.44) {
      return res.status(404).json({
        error: 'Not Found',
      });
    } else if (choice < 0.55) {
      return res.status(410).json({
        error: 'Gone',
      });
    } else if (choice < 0.66) {
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    } else if (choice < 0.77) {
      return res.status(501).json({
        error: 'Not Implemented',
      });
    } else if (choice < 0.88) {
      return res.status(503).json({
        error: 'Service Unavailable',
      });
    } else {
      return res.status(550).json({
        error: 'Permission denied',
      });
    }
  } else {
    // Continue to JSON Server router
    next();
  }
};

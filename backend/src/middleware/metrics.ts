import { Request, Response, NextFunction } from 'express';
import { metricsService } from '../services/metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    metricsService.recordLatency(duration);
  });

  next();
};
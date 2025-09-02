import express, { Request, Response, Express, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import { redis } from './utils/redis';
import router from './api/v1';
import { requestLogger, errorLogger } from './utils/logger';
import { swaggerRouter } from './swagger/router';
config();

import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later.',
});

export const createServer = (): Express => {
  const app = express();

  app.disable('x-powered-by');

  app.use(morgan('dev'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cors());

  app.use((req: Request, res: Response, next: NextFunction) => {
    requestLogger(req);
    next();
  });

  app.use(swaggerRouter);

  redis.connect().catch((err) => errorLogger(err, 'Redis Connection'));

  app.use('/api/v1', apiLimiter, router);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      success: false,
      message: 'The requested resource was not found',
    });
  });

  return app;
};

import express, { Request, Response, Express, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import { redis } from './utils/redis';
import router from './api/v1';
import roleRouter from './api/v1/role/route';
import reportRouter from './api/v1/report/route'; 
import { requestLogger, errorLogger } from './utils/logger';
import { swaggerRouter } from './swagger/router';
import rateLimit from 'express-rate-limit';

config();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
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

  app.get('/', (req: Request, res: Response) => {
    res.json({ success: true, message: 'API is running', data: null });
  });

  app.use('/api/v1', apiLimiter);

  // Mount routers
  app.use('/api/v1', router);
  app.use('/api/v1/roles', roleRouter);
  app.use('/api/v1/reports', reportRouter);

  
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      success: false,
      message: 'The requested resource was not found',
    });
  });

  return app;
};

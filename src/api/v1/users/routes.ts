import express, { Router, Request, Response } from 'express';

const userRoutes: Router = express.Router();

userRoutes.get('/', (req: Request, res: Response) => {
  res.status(200).json([]);
});

userRoutes.get('/:id', (req: Request, res: Response) => {
  res.status(200).json({ id: 1, user: 'John' });
});

export default userRoutes;

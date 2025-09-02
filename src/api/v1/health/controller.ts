import { Request, Response } from 'express';
import { config } from 'dotenv';
config();

export class Health {
    public check(req: Request, res: Response): void {
    res.json({ ok: true, environment: process.env.PORT});
  };
};
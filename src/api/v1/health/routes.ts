import { Router } from 'express';
import { Health } from './controller';

const healthRoutes: Router = Router();
const controller = new Health();

healthRoutes.get('/check', controller.check);

export default healthRoutes;

import { Router } from 'express';
import ReportController from './controller';

const router = Router();

router.post('/', ReportController.createReport);

router.get('/', ReportController.getReports);

router.get('/:id', ReportController.getReportById);

router.delete('/:id', ReportController.deleteReport);

export default router;

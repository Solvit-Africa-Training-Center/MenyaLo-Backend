import { Request, Response } from 'express';
import { reportService } from '../report/service';

class ReportController {
  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const { reporterId, reportedId, reason } = req.body;

      if (!reporterId || !reportedId) {
        res.json({ success: false, message: 'Reporter and Reported IDs are required', data: null });
        return;
      }

      const report = await reportService.createReport({ reporterId, reportedId, reason });
      res.json({ success: true, message: 'Report created successfully', data: report });
    } catch {
      res.json({ success: false, message: 'Failed to create report', data: null });
    }
  }

  async getReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await reportService.getReports();
      res.json({ success: true, message: 'Reports fetched successfully', data: reports });
    } catch {
      res.json({ success: false, message: 'Failed to fetch reports', data: null });
    }
  }

  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const report = await reportService.getReportById(req.params.id);
      if (!report) {
        res.json({ success: false, message: 'Report not found', data: null });
        return;
      }
      res.json({ success: true, message: 'Report fetched successfully', data: report });
    } catch {
      res.json({ success: false, message: 'Failed to fetch report', data: null });
    }
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const success = await reportService.deleteReport(req.params.id);
      if (!success) {
        res.json({ success: false, message: 'Report not found', data: null });
        return;
      }
      res.json({ success: true, message: 'Report deleted successfully', data: null });
    } catch {
      res.json({ success: false, message: 'Failed to delete report', data: null });
    }
  }
}

export default new ReportController();

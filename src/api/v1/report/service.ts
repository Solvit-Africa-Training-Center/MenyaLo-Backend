import { Report } from '../../../database/models/Report';
import { User } from '../../../database/models/User';

class ReportService {
  async createReport({
    reporterId,
    reportedId,
    reason,
  }: {
    reporterId: string;
    reportedId: string;
    reason?: string;
  }): Promise<Report> {
    // Create the report
    const report = await Report.create({ reporterId, reportedId, reason });

   // count reports
    const count = await Report.count({
      where: { reportedId },
    });

    const reportedUser = await User.findByPk(reportedId);
    if (!reportedUser) {
      throw new Error(`User with ID ${reportedId} not found.`);
    }

    if (count >= 10) {
      reportedUser.isActive = false; 
      await reportedUser.save();
    } else if (count >= 5) {
    // TODO: Implement proper logging here, e.g., using a logger service
      // logger.warn(`User ${reportedId} has received a warning!`);
    }

    return report;
  }

  async getReports(): Promise<Report[]> {
    return Report.findAll({ include: ['reporter', 'reported'] });
  }

  async getReportById(id: string): Promise<Report | null> {
    return Report.findByPk(id, { include: ['reporter', 'reported'] });
  }

  async deleteReport(id: string): Promise<boolean> {
    const report = await Report.findByPk(id);
    if (!report) {
      return false;
    }
    await report.destroy();
    return true;
  }
}

export const reportService = new ReportService();

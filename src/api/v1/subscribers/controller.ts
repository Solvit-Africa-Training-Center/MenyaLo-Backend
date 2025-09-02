import { Request, Response } from 'express';
import { SubscriptionService } from './service';
import { RequestSubscriberInterface } from './subscribe';
import { IRequestUser } from '../../../middleware/unifiedAuthMiddleware';

export class SubscriptionController {
  public async subscribe(req: RequestSubscriberInterface, res: Response): Promise<void> {
    try {
      const { token } = req.query;
      const service = new SubscriptionService(req.body, token as string, res);
      service.subscribe();
    } catch (error) {
      throw error as Error;
    }
  }

  public async unsubscribe(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query;
      const service = new SubscriptionService(req.body, token as string, res);
      service.unsubscribe();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getSubscribers(req: IRequestUser, res: Response): Promise<void> {
    try {
      const { token } = req.query;
      const service = new SubscriptionService(req.body, token as string, res);
      service.getSubscribers();
    } catch (error) {
      throw error as Error;
    }
  }
}

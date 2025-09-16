import { ResponseService } from '../../../utils/response';
import { Response } from 'express';
import { Database } from '../../../database';
import { sendMail } from '../../../services/external/mailer';
import { CreateSubscriberInterface } from './subscribe';
import jwt from 'jsonwebtoken';

export class SubscriptionService {
  data: CreateSubscriberInterface;
  token: string;
  res: Response;

  constructor(data: CreateSubscriberInterface, token: string, res: Response) {
    this.data = data;
    this.token = token;
    this.res = res;
  }

  async subscribe(): Promise<void> {
    try {
      const { email } = this.data;
      const userName = await Database.User.findOne({
        where: { email: this.data.email },
        raw: true,
      });
      const subscriber = await Database.Subscriber.findOne({
        where: { email: this.data.email },
        raw: true,
        paranoid: false,
      });
      if (subscriber?.subscribed === false) {
        await Database.Subscriber.update(
          { subscribed: true },
          { where: { email: this.data.email } },
        );
        sendMail(
          email as string,
          userName?.username as string,
          'resubscribed',
          'Welcome back to Menyalo',
        );
        ResponseService({
          data: subscriber,
          status: 200,
          success: true,
          message: 'Subcriber restored',
          res: this.res,
        });
      } else if (subscriber?.subscribed === true) {
        sendMail(
          email as string,
          userName?.name as string,
          'existing-subscriber',
          'You are already a cherished member of Menyalo',
        );
        ResponseService({
          data: subscriber,
          status: 200,
          success: true,
          message: 'Subcriber already exists',
          res: this.res,
        });
      } else {
        if (!this.data.email) {
          ResponseService({
            data: null,
            status: 400,
            success: false,
            message: 'Email is required',
            res: this.res,
          });
          return;
        }
        await Database.Subscriber.create({
          email: this.data.email,
          subscribed: true,
        });
        sendMail(
          email as string,
          userName?.name as string,
          'subscribe',
          'You are in! Welcome to Menyalo',
        );
        ResponseService({
          data: subscriber,
          status: 200,
          success: true,
          message: 'Subscribed',
          res: this.res,
        });
      }
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async unsubscribe(): Promise<void> {
    try {
      const decoded = jwt.verify(this.token as string, process.env.JWT_SECRET!) as {
        email: string;
      };
      const email = decoded.email;
      const userName = await Database.User.findOne({
        where: { email: this.data.email },
        raw: true,
      });

      await Database.Subscriber.update({ subscribed: false }, { where: { email } });

      ResponseService({
        data: email,
        status: 200,
        success: true,
        message: 'Unsubscribed',
        res: this.res,
      });
      sendMail(
        email,
        userName?.name as string,
        'unsubscribe',
        "You've been unsubscribed from Menyalo",
      );
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 400,
        message: 'Invalid or expired unsubscribe link.',
        res: this.res,
      });
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async getSubscribers(): Promise<void> {
    try {
      const subscribers = await Database.Subscriber.findAll({
        where: { subscribed: true },
        raw: true,
      });
      if (!subscribers) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Subscribers not found!',
          res: this.res,
        });
        return;
      }
      ResponseService({
        data: subscribers,
        status: 200,
        success: true,
        message: `'Subscribers: '${subscribers.length}`,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }
}

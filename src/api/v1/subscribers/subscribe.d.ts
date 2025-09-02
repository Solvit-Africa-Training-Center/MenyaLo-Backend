import { Request } from 'express';

export interface RequestSubscriberInterface extends Request {
  body: {
    email: string;
  };
}

interface SubscriberInterface {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

type CreateSubscriberInterface = Partial<
  Omit<SubscriberInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

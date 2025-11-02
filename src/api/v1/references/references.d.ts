import { IRequestUser } from '../../../middleware/unifiedAuthMiddleware';

type ReferenceType = 'Law' | 'Article' | 'Commentary';

interface ReferenceInterface {
  id: string;
  lawId: string;
  type: ReferenceType;
  title: string;
  citation: string;
  url?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type CreateReferenceInterface = Omit<ReferenceInterface, 'id' | 'lawId' | 'deletedAt'>;
type UpdateReferenceInterface = Partial<Omit<ReferenceInterface, 'id' | 'lawId' | 'createdAt'>>;

interface LawInfo {
  id: string;
  lawNumber: string;
  title: string;
}

interface ReferenceWithLaw extends ReferenceInterface {
  law?: LawInfo;
}

interface ReferenceRequestInterface extends IRequestUser {
  body: CreateReferenceInterface;
  params: {
    lawId: string;
    id: string;
  };
  query: {
    type?: ReferenceType;
  };
}

interface UpdateReferenceRequestInterface extends IRequestUser {
  body: UpdateReferenceInterface;
  params: {
    lawId: string;
    id: string;
  };
}

interface GetAllReferences {
  references: ReferenceWithLaw[];
}

export {
  ReferenceInterface,
  CreateReferenceInterface,
  UpdateReferenceInterface,
  ReferenceRequestInterface,
  UpdateReferenceRequestInterface,
  GetAllReferences,
  ReferenceType,
  ReferenceWithLaw,
  LawInfo,
};
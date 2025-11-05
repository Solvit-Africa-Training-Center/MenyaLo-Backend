import { IRequestUser } from '../../../middleware/unifiedAuthMiddleware';

type ReferenceType = 'Law' | 'Article' | 'Commentary';

interface ReferenceInterface {
  id: string;
  lawId: string;
  articleId?: string | null;
  parentReferenceId?: string | null;
  userId?: string | null;
  type: ReferenceType;
  title: string;
  citation?: string | null;
  url?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type CreateReferenceInterface = {
  lawId?: string;
  articleId?: string;
  referenceId?: string;
  title: string;
  citation?: string;
  url?: string;
  notes?: string;
};

type UpdateReferenceInterface = Partial<{
  title: string;
  citation: string ;
  url: string;
  notes: string;
}>;

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface LawInfo {
  id: string;
  lawNumber: string;
  title: string;
}

interface ArticleInfo {
  id: string;
  articleNumber: string;
  title: string;
}

interface ReferenceWithRelations extends ReferenceInterface {
  law?: LawInfo;
  article?: ArticleInfo;
  user?: UserInfo | null;
  parentReference?: Partial<ReferenceInterface>;
}

interface ReferenceRequestInterface extends IRequestUser {
  body: CreateReferenceInterface;
  params: {
    id?: string;
  };
  query: {
    lawId?: string;
    articleId?: string;
    referenceId?: string;
    type?: ReferenceType;
  };
}

interface UpdateReferenceRequestInterface extends IRequestUser {
  body: UpdateReferenceInterface;
  params: {
    id: string;
  };
}

interface GetAllReferences {
  references: ReferenceWithRelations[];
}

export {
  ReferenceInterface,
  CreateReferenceInterface,
  UpdateReferenceInterface,
  ReferenceRequestInterface,
  UpdateReferenceRequestInterface,
  GetAllReferences,
  ReferenceType,
  ReferenceWithRelations,
  LawInfo,
  ArticleInfo,
  UserInfo,
};
import { IRequestUser } from '../../../middleware/unifiedAuthMiddleware';

interface HashtagInterface {
  id: string;
  name: string;
  postCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface PostInterface {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type CreatePostInterface = Omit<PostInterface, 'id' | 'deletedAt'>;
type UpdatePostInterface = Partial<Omit<PostInterface, 'id' | 'createdAt' | 'authorId'>>;

interface HashtagRequestInterface extends IRequestUser {
  params: {
    id?: string;
    name?: string;
  };
  query: {
    page?: string;
    limit?: string;
    sort?: 'trending' | 'alphabetical';
    q?: string;
  };
}

interface PostRequestInterface extends IRequestUser {
  body: CreatePostInterface;
  params: {
    id?: string;
  };
}

interface UpdatePostRequestInterface extends IRequestUser {
  body: UpdatePostInterface;
  params: {
    id: string;
  };
}

interface GetAllHashtags {
  hashtags: HashtagInterface[];
}

interface GetAllPosts {
  posts: PostInterface[];
}

export {
  HashtagInterface,
  PostInterface,
  CreatePostInterface,
  UpdatePostInterface,
  HashtagRequestInterface,
  PostRequestInterface,
  UpdatePostRequestInterface,
  GetAllHashtags,
  GetAllPosts,
};
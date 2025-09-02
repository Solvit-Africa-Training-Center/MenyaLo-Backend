import { IRequestUser } from '../../../middleware/unifiedAuthMiddleware';

interface PostInterface {
  id: string;
  title?: string;
  slug?: string;
  content: string;
  image_url?: string;
  authorId: string;
  isPublished: boolean;
  hashtags: string[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
}

type CreatePostInterface = Omit<PostInterface, 'id' | 'deletedAt'>;
type UpdatePostInterface = Partial<Omit<PostInterface, 'id' | 'createdAt'>>;

interface PostRequestInterface extends IRequestUser {
  body: CreatePostInterface;
  params: {
    id: string;
  };
  query: {
    page?: string;
    limit?: string;
  };
  file?: Express.Multer.File;
}

interface UpdatePostRequestInterface extends IRequestUser {
  body: UpdatePostInterface;
  params: {
    id: string;
  };
  file?: Express.Multer.File;
}

interface HashtagRequestInterface extends IRequestUser {
  params: {
    name?: string;
  };
  query: {
    page?: string;
    limit?: string;
  };
}

interface SearchRequestInterface extends IRequestUser {
  query: {
    q?: string;
    page?: string;
    limit?: string;
  };
}

interface GetAllPosts {
  posts: PostInterface[];
}

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

interface TrendingHashtag {
  hashtag: string;
  count: number;
}

export {
  PostInterface,
  CreatePostInterface,
  UpdatePostInterface,
  PostRequestInterface,
  UpdatePostRequestInterface,
  HashtagRequestInterface,
  SearchRequestInterface,
  GetAllPosts,
  PaginationMetadata,
  PaginatedResponse,
  TrendingHashtag,
};
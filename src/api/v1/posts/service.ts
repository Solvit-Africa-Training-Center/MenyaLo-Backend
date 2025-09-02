import { Response } from 'express';
import { Op } from 'sequelize';
import { Database } from '../../../database';
import { ResponseService } from '../../../utils/response';
import {
  CreatePostInterface,
  GetAllPosts,
  PostInterface,
  UpdatePostInterface,
  PaginationMetadata,
  PaginatedResponse,
  TrendingHashtag,
} from './posts';
import { generateSlug } from '../../../utils/helper';
import { uploadToCloudinary } from '../../../utils/upload';

export class PostService {
  data: PostInterface | CreatePostInterface | UpdatePostInterface;
  userId: string;
  dataId: string;
  file: Express.Multer.File;
  res: Response;
  page: number;
  limit: number;
  searchQuery?: string;
  hashtagName?: string;

  constructor(
    data: PostInterface | CreatePostInterface | UpdatePostInterface,
    userId: string,
    dataId: string,
    file: Express.Multer.File,
    res: Response,
    page = 1,
    limit = 10,
    searchQuery?: string,
    hashtagName?: string,
  ) {
    this.data = data;
    this.userId = userId;
    this.dataId = dataId;
    this.file = file;
    this.res = res;
    this.page = page;
    this.limit = limit;
    this.searchQuery = searchQuery;
    this.hashtagName = hashtagName;
  }

  private async postExist(): Promise<{ exists: boolean; error?: unknown }> {
    try {
      const post = await Database.Post.findOne({ where: { id: this.dataId }, raw: true });
      if (!post) {
        return { exists: false };
      } else {
        return { exists: true };
      }
    } catch (error) {
      return { exists: false, error };
    }
  }

  private extractHashtags(postContent: string): string[] {
    const hashtagRegex = /#\w+/g;
    const hashtags = postContent.match(hashtagRegex);
    return hashtags ? [...new Set(hashtags.map((tag: string) => tag.toLowerCase()))] : [];
  }

  private calculatePagination(total: number): PaginationMetadata {
    const totalPages = Math.ceil(total / this.limit);
    return {
      currentPage: this.page,
      totalPages,
      totalItems: total,
      itemsPerPage: this.limit,
      hasNextPage: this.page < totalPages,
      hasPrevPage: this.page > 1,
    };
  }

  async create(): Promise<unknown> {
    try {
      const author = await Database.User.findOne({ where: { id: this.userId }, raw: true });
      if (!author) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Author not found',
          res: this.res,
        });
      }
      let image_url = '';

      if (this.file) {
        try {
          image_url = await uploadToCloudinary(this.file as Express.Multer.File);
        } catch (error) {
          const { message, stack } = error as Error;
          return ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res: this.res,
          });
        }
      }
      const { title, content } = this.data as CreatePostInterface;
      const hashtags = this.extractHashtags(content);
      const post = await Database.Post.create({
        title,
        slug: generateSlug(title as string) ?? ('' as string),
        content,
        authorId: author.id,
        image_url: image_url as string,
        isPublished: true,
        hashtags: hashtags as string[],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return ResponseService({
        data: post,
        status: 201,
        success: true,
        message: 'Post successfully created',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findAll(): Promise<unknown> {
    try {
      const offset = (this.page - 1) * this.limit;

      const { count, rows: posts } = await Database.Post.findAndCountAll({
        include: [
          {
            model: Database.User,
            as: 'author',
            attributes: ['id', 'name', 'username'],
          },
          {
            model: Database.Upvote,
            as: 'upvotes',
          },
          {
            model: Database.Comment,
            as: 'comments',
            attributes: ['id', 'authorId', 'content'],
            include: [
              {
                model: Database.User,
                as: 'author',
                attributes: ['id', 'name', 'username'],
              },
              {
                model: Database.Reply,
                as: 'replies',
                attributes: ['id', 'authorId', 'content'],
              },
            ],
          },
        ],
        limit: this.limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      if (!posts || posts.length === 0) {
        return ResponseService<PaginatedResponse<GetAllPosts>>({
          data: {
            data: [],
            pagination: this.calculatePagination(0),
          },
          status: 200,
          success: true,
          message: 'No posts found',
          res: this.res,
        });
      }

      return ResponseService({
        data: {
          data: posts,
          pagination: this.calculatePagination(count),
        },
        status: 200,
        message: 'Posts successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findOne(): Promise<unknown> {
    try {
      const postCheck = await this.postExist();

      if (postCheck.error) {
        const { message, stack } = postCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!postCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Post not found',
          res: this.res,
        });
      }

      const post = await Database.Post.findOne({
        where: { id: this.dataId },
        include: [
          {
            model: Database.User,
            as: 'author',
            attributes: ['id', 'name', 'username'],
          },
          {
            model: Database.Comment,
            as: 'comments',
            attributes: ['id', 'authorId', 'content'],
            include: [
              {
                model: Database.User,
                as: 'author',
                attributes: ['id', 'name', 'username'],
              },
            ],
          },
        ],
      });

      return ResponseService({
        data: post,
        status: 200,
        message: 'Post successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async update(): Promise<unknown> {
    try {
      const postCheck = await this.postExist();
      if (postCheck.error) {
        const { message, stack } = postCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }
      if (!postCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Post not found',
          res: this.res,
        });
      }

      let image_url = '';

      if (this.file) {
        try {
          image_url = await uploadToCloudinary(this.file as Express.Multer.File);
        } catch (error) {
          const { message, stack } = error as Error;
          return ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res: this.res,
          });
        }
      }
      const updateData: UpdatePostInterface = { ...this.data };
      if (image_url) {
        updateData.image_url = image_url;
      }

      if (updateData.content) {
        const hashtags = this.extractHashtags(updateData.content);
        updateData.hashtags = hashtags;
      }

      const updatedPost = await Database.Post.update(
        {
          ...updateData,
          slug: generateSlug(updateData.title as string),
          authorId: this.userId,
          updatedAt: new Date(),
        },
        { where: { id: this.dataId } },
      );

      return ResponseService({
        data: updatedPost,
        success: true,
        status: 200,
        message: 'Post successfully updated',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async delete(): Promise<unknown> {
    try {
      const postCheck = await this.postExist();

      if (postCheck.error) {
        const { message, stack } = postCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!postCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Post not found',
          res: this.res,
        });
      }

      const deletedPost = await Database.Post.destroy({ where: { id: this.dataId } });

      return ResponseService({
        data: deletedPost,
        success: true,
        status: 200,
        message: 'Post successfully deleted',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async getTrendingHashtags(): Promise<unknown> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const posts = await Database.Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: oneDayAgo,
          },
        },
        attributes: ['hashtags'],
        raw: true,
      });

      const hashtagCounts: Record<string, number> = {};

      posts.forEach((post: { hashtags: string[] }) => {
        if (post.hashtags && Array.isArray(post.hashtags)) {
          post.hashtags.forEach((tag: string) => {
            const normalizedTag = tag.toLowerCase();
            hashtagCounts[normalizedTag] = (hashtagCounts[normalizedTag] || 0) + 1;
          });
        }
      });

      const trendingHashtags: TrendingHashtag[] = Object.entries(hashtagCounts)
        .map(([hashtag, count]) => ({ hashtag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return ResponseService({
        data: trendingHashtags,
        status: 200,
        success: true,
        message: 'Trending hashtags retrieved successfully',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async getPostsByHashtag(): Promise<unknown> {
    try {
      const offset = (this.page - 1) * this.limit;
      const normalizedHashtag = this.hashtagName?.toLowerCase();

      const { count, rows: posts } = await Database.Post.findAndCountAll({
        where: {
          hashtags: normalizedHashtag ? {
            [Op.contains]: [normalizedHashtag],
          } : undefined,
        },
        include: [
          {
            model: Database.User,
            as: 'author',
            attributes: ['id', 'name', 'username'],
          },
          {
            model: Database.Upvote,
            as: 'upvotes',
          },
          {
            model: Database.Comment,
            as: 'comments',
            attributes: ['id', 'authorId', 'content'],
            include: [
              {
                model: Database.User,
                as: 'author',
                attributes: ['id', 'name', 'username'],
              },
            ],
          },
        ],
        limit: this.limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      if (!posts || posts.length === 0) {
        return ResponseService<PaginatedResponse<PostInterface>>({
          data: {
            data: [],
            pagination: this.calculatePagination(0),
          },
          status: 200,
          success: true,
          message: `No posts found for hashtag: ${this.hashtagName}`,
          res: this.res,
        });
      }

      return ResponseService({
        data: {
          data: posts,
          pagination: this.calculatePagination(count),
        },
        status: 200,
        message: `Posts with hashtag ${this.hashtagName} retrieved successfully`,
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async getAllHashtags(): Promise<unknown> {
    try {
      const offset = (this.page - 1) * this.limit;

      const posts = await Database.Post.findAll({
        attributes: ['hashtags'],
        raw: true,
      });

      const allHashtags = new Set<string>();

      posts.forEach((post: { hashtags: string[] }) => {
        if (post.hashtags && Array.isArray(post.hashtags)) {
          post.hashtags.forEach((tag: string) => {
            allHashtags.add(tag.toLowerCase());
          });
        }
      });

      const hashtagsArray = Array.from(allHashtags).sort();
      const total = hashtagsArray.length;
      const paginatedHashtags = hashtagsArray.slice(offset, offset + this.limit);

      if (paginatedHashtags.length === 0) {
        return ResponseService({
          data: {
            data: [],
            pagination: this.calculatePagination(0),
          },
          status: 200,
          success: true,
          message: 'No hashtags found',
          res: this.res,
        });
      }

      return ResponseService({
        data: {
          data: paginatedHashtags,
          pagination: this.calculatePagination(total),
        },
        status: 200,
        message: 'Hashtags retrieved successfully',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async searchPostsAndHashtags(): Promise<unknown> {
    try {
      const offset = (this.page - 1) * this.limit;
      const searchTerm = this.searchQuery?.toLowerCase() || '';

      const { count, rows: posts } = await Database.Post.findAndCountAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
            {
              content: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
            {
              hashtags: {
                [Op.overlap]: [searchTerm, `#${searchTerm}`],
              },
            },
          ],
        },
        include: [
          {
            model: Database.User,
            as: 'author',
            attributes: ['id', 'name', 'username'],
          },
          {
            model: Database.Upvote,
            as: 'upvotes',
          },
          {
            model: Database.Comment,
            as: 'comments',
            attributes: ['id', 'authorId', 'content'],
            include: [
              {
                model: Database.User,
                as: 'author',
                attributes: ['id', 'name', 'username'],
              },
            ],
          },
        ],
        limit: this.limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      if (!posts || posts.length === 0) {
        return ResponseService<PaginatedResponse<PostInterface>>({
          data: {
            data: [],
            pagination: this.calculatePagination(0),
          },
          status: 200,
          success: true,
          message: `No results found for: ${this.searchQuery}`,
          res: this.res,
        });
      }

      return ResponseService({
        data: {
          data: posts,
          pagination: this.calculatePagination(count),
        },
        status: 200,
        message: `Search results for: ${this.searchQuery}`,
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }
}
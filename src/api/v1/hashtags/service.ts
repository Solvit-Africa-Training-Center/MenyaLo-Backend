import { Response } from 'express';
import { Op, Order } from 'sequelize';
import { Database } from '../../../database';
import { ResponseService } from '../../../utils/response';
import { CreatePostInterface, GetAllPosts, PostInterface, UpdatePostInterface } from './hashtags';
import { extractHashtags } from '../../../utils/extractHashtags';

export class HashtagService {
  data: PostInterface | CreatePostInterface | UpdatePostInterface;
  dataId: string;
  res: Response;
  filters?: {
    page?: number;
    limit?: number;
    sort?: 'trending' | 'alphabetical';
    q?: string;
    name?: string;
  };

  constructor(data: any, dataId: string, res: Response, filters?: any) {
    this.data = data;
    this.dataId = dataId;
    this.res = res;
    this.filters = filters;
  }

  private async postExists() {
    try {
      const post = await Database.Post.findOne({
        where: { id: this.dataId },
      });

      return { exists: !!post };
    } catch (error) {
      return { exists: false, error };
    }
  }

  // ✅ CREATE POST WITH HASHTAGS
  async createPost() {
    try {
      const { title, content, authorId } = this.data as CreatePostInterface;

      const tags = extractHashtags(`${title} ${content}`);

      // ✅ Correct: use Database.database.transaction
      type Transaction = import('sequelize').Transaction;

      interface HashtagInstance {
        id: string;
        name: string;
        postCount: number;
        createdAt?: Date;
        updatedAt?: Date;
      }

      interface PostInstance {
        id: string;
        title?: string;
        content?: string;
        authorId?: string;
        createdAt?: Date;
        updatedAt?: Date;
        addHashtags?: (hashtags: any[], options?: { transaction?: Transaction }) => Promise<void>;
      }

      const postId = await Database.database.transaction(
        async (t: Transaction): Promise<string> => {
          const post = (await Database.Post.create(
            {
              title,
              content,
              authorId,
              isPublished: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { transaction: t },
          )) as PostInstance;

          if (tags.length > 0) {
            const hashtagInstances: HashtagInstance[] = [];

            for (const tag of tags) {
              const [hashtag] = (await Database.Hashtag.findOrCreate({
                where: { name: tag },
                defaults: { name: tag, postCount: 0 },
                transaction: t,
              })) as [HashtagInstance, boolean];

              hashtagInstances.push(hashtag);
            }

            // Link hashtags to post
            await post.addHashtags?.(hashtagInstances as any, { transaction: t });

            // Increment postCount
            await Database.Hashtag.increment('postCount', {
              by: 1,
              where: { id: hashtagInstances.map((h) => h.id) },
              transaction: t,
            });
          }

          return post.id;
        },
      );

      const postWithHashtags = await Database.Post.findByPk(postId, {
        include: [{ model: Database.Hashtag }],
      });

      return ResponseService({
        data: postWithHashtags,
        status: 201,
        success: true,
        message: 'Post successfully created',
        res: this.res,
      });
    } catch (error: any) {
      return ResponseService({
        data: { message: error.message, stack: error.stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  // ✅ GET ALL HASHTAGS
  async findAllHashtags() {
    try {
      const page = Math.max(this.filters?.page || 1, 1);
      const limit = Math.max(this.filters?.limit || 10, 1);
      const offset = (page - 1) * limit;

      const sort = this.filters?.sort || 'trending';

      const order: Order =
        sort === 'alphabetical'
          ? [['name', 'ASC']]
          : [
              ['postCount', 'DESC'],
              ['name', 'ASC'],
            ];

      const { rows, count } = await Database.Hashtag.findAndCountAll({
        order,
        limit,
        offset,
      });

      return ResponseService({
        data: {
          items: rows,
          meta: {
            page,
            limit,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
          },
        },
        status: 200,
        message: 'Hashtags successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error: any) {
      return ResponseService({
        data: { message: error.message, stack: error.stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  // ✅ TRENDING HASHTAGS
  async findTrendingHashtags() {
    try {
      const limit = Math.max(this.filters?.limit || 10, 1);

      const hashtags = await Database.Hashtag.findAll({
        order: [
          ['postCount', 'DESC'],
          ['name', 'ASC'],
        ],
        limit,
      });

      const ranked = hashtags.map((h, index) => ({
        id: h.id,
        name: h.name,
        postCount: h.postCount,
        createdAt: h.createdAt,
        rank: index + 1,
      }));

      return ResponseService({
        data: { items: ranked },
        status: 200,
        message: 'Trending hashtags successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error: any) {
      return ResponseService({
        data: { message: error.message, stack: error.stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  // ✅ SEARCH HASHTAGS
  async searchHashtags() {
    try {
      const q = this.filters?.q?.toLowerCase() || '';
      const limit = Math.max(this.filters?.limit || 10, 1);

      if (!q) {
        return ResponseService({
          data: { items: [] },
          status: 200,
          success: true,
          res: this.res,
          message: 'No search query provided',
        });
      }

      const items = await Database.Hashtag.findAll({
        where: { name: { [Op.iLike]: `%${q}%` } },
        order: [['name', 'ASC']],
        limit,
      });

      return ResponseService({
        data: { items },
        status: 200,
        message: 'Search results successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error: any) {
      return ResponseService({
        data: { message: error.message, stack: error.stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  // ✅ GET POSTS BY ONE HASHTAG
  async findPostsByHashtag() {
    try {
      const nameParam = this.filters?.name?.toLowerCase() || '';

      if (!nameParam) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Hashtag name is required',
          res: this.res,
        });
      }

      const page = Math.max(this.filters?.page || 1, 1);
      const limit = Math.max(this.filters?.limit || 10, 1);
      const offset = (page - 1) * limit;

      const hashtag = await Database.Hashtag.findOne({
        where: { name: nameParam },
      });

      if (!hashtag) {
        return ResponseService({
          data: {
            items: [],
            meta: { page, limit, totalItems: 0, totalPages: 0 },
          },
          status: 200,
          success: true,
          message: 'No posts found for this hashtag',
          res: this.res,
        });
      }

      const { rows, count } = await Database.Post.findAndCountAll({
        include: [
          {
            model: Database.Hashtag,
            where: { id: hashtag.id },
            through: { attributes: [] },
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return ResponseService({
        data: {
          items: rows,
          meta: {
            page,
            limit,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
          },
        },
        status: 200,
        message: 'Posts successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error: any) {
      return ResponseService({
        data: { message: error.message, stack: error.stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }
}

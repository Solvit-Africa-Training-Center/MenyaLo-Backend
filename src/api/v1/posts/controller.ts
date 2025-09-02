import { Response } from 'express';
import { PostService } from './service';
import {
  PostRequestInterface,
  UpdatePostRequestInterface,
  HashtagRequestInterface,
  SearchRequestInterface,
} from './posts';

export class PostController {
  public async createPost(req: PostRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req?.user?.id as string;
      const { file } = req;
      const postService = new PostService(req.body, user, id, file as Express.Multer.File, res);
      postService.create();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAllPosts(req: PostRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req?.user?.id as string;
      const { file } = req;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const postService = new PostService(
        req.body,
        user,
        id,
        file as Express.Multer.File,
        res,
        page,
        limit,
      );
      postService.findAll();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAPost(req: PostRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req?.user?.id as string;
      const { file } = req;
      const postService = new PostService(req.body, user, id, file as Express.Multer.File, res);
      postService.findOne();
    } catch (error) {
      throw error as Error;
    }
  }

  public async updatePost(req: UpdatePostRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req?.user?.id as string;
      const { file } = req;
      const postService = new PostService(req.body, user, id, file as Express.Multer.File, res);
      postService.update();
    } catch (error) {
      throw error as Error;
    }
  }

  public async deletePost(req: PostRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req?.user?.id as string;
      const { file } = req;
      const postService = new PostService(req.body, user, id, file as Express.Multer.File, res);
      postService.delete();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getTrendingHashtags(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      const postService = new PostService({} as never, user, '', undefined as never, res);
      postService.getTrendingHashtags();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getPostsByHashtag(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      const { name } = req.params;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const postService = new PostService(
        {} as never,
        user,
        '',
        undefined as never,
        res,
        page,
        limit,
        undefined,
        name,
      );
      postService.getPostsByHashtag();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAllHashtags(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const postService = new PostService(
        {} as never,
        user,
        '',
        undefined as never,
        res,
        page,
        limit,
      );
      postService.getAllHashtags();
    } catch (error) {
      throw error as Error;
    }
  }

  public async searchPostsAndHashtags(req: SearchRequestInterface, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      const { q } = req.query;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const postService = new PostService(
        {} as never,
        user,
        '',
        undefined as never,
        res,
        page,
        limit,
        q,
      );
      postService.searchPostsAndHashtags();
    } catch (error) {
      throw error as Error;
    }
  }
}
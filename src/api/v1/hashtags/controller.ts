import { Response } from 'express';
import { HashtagService } from './service';
import { HashtagRequestInterface, PostRequestInterface } from './hashtags';

export class HashtagController {
  public async createPost(req: PostRequestInterface, res: Response): Promise<void> {
    try {
      const hashtagService = new HashtagService(req.body, '', res);
      hashtagService.createPost();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAllHashtags(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const filters = {
        page: parseInt(req.query?.page || '1', 10),
        limit: parseInt(req.query?.limit || '10', 10),
        sort: req.query?.sort || ('trending' as 'trending' | 'alphabetical'),
      };
      const hashtagService = new HashtagService({} as never, '', res, filters);
      hashtagService.findAllHashtags();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getTrendingHashtags(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const filters = {
        limit: parseInt(req.query?.limit || '10', 10),
      };
      const hashtagService = new HashtagService({} as never, '', res, filters);
      hashtagService.findTrendingHashtags();
    } catch (error) {
      throw error as Error;
    }
  }

  public async searchHashtags(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const filters = {
        q: req.query?.q,
        limit: parseInt(req.query?.limit || '10', 10),
      };
      const hashtagService = new HashtagService({} as never, '', res, filters);
      hashtagService.searchHashtags();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getPostsByHashtag(req: HashtagRequestInterface, res: Response): Promise<void> {
    try {
      const filters = {
        name: req.params?.name,
        page: parseInt(req.query?.page || '1', 10),
        limit: parseInt(req.query?.limit || '10', 10),
      };
      const hashtagService = new HashtagService({} as never, '', res, filters);
      hashtagService.findPostsByHashtag();
    } catch (error) {
      throw error as Error;
    }
  }
}
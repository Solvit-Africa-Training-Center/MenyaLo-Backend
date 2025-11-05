import { Response } from 'express';
import { Database } from '../../../database';
import { ResponseService } from '../../../utils/response';
import {
  CreateReferenceInterface,
  GetAllReferences,
  ReferenceInterface,
  UpdateReferenceInterface,
  ReferenceType,
} from './references';

export class ReferenceService {
  data: ReferenceInterface | CreateReferenceInterface | UpdateReferenceInterface;
  dataId: string;
  userId?: string;
  res: Response;
  filters?: {
    lawId?: string;
    articleId?: string;
    referenceId?: string;
    type?: ReferenceType;
  };

  constructor(
    data: ReferenceInterface | CreateReferenceInterface | UpdateReferenceInterface,
    dataId: string,
    res: Response,
    filters?: {
      lawId?: string;
      articleId?: string;
      referenceId?: string;
      type?: ReferenceType;
    },
    userId?: string,
  ) {
    this.data = data;
    this.dataId = dataId;
    this.userId = userId;
    this.res = res;
    this.filters = filters;
  }

  private async validateTarget(
    lawId?: string,
    articleId?: string,
    referenceId?: string,
  ): Promise<{
    valid: boolean;
    error?: string;
    targetLawId?: string;
    type?: ReferenceType;
  }> {
    try {
      // Validate based on what's provided
      if (referenceId) {
        const parentReference = await Database.Reference.findOne({
          where: { id: referenceId },
          attributes: ['id', 'lawId', 'type'],
          raw: true,
        });

        if (!parentReference) {
          return { valid: false, error: 'Reference not found' };
        }

        if (parentReference.type === 'Commentary') {
          return { valid: false, error: 'Cannot create commentary on another commentary' };
        }

        return {
          valid: true,
          targetLawId: parentReference.lawId,
          type: 'Commentary',
        };
      }

      if (articleId) {
        const article = await Database.Article.findOne({
          where: { id: articleId },
          attributes: ['id', 'lawId'],
          raw: true,
        });

        if (!article) {
          return { valid: false, error: 'Article not found' };
        }

        return {
          valid: true,
          targetLawId: article.lawId,
          type: 'Article',
        };
      }

      if (lawId) {
        const law = await Database.Law.findOne({
          where: { id: lawId },
          attributes: ['id'],
          raw: true,
        });

        if (!law) {
          return { valid: false, error: 'Law not found' };
        }

        return {
          valid: true,
          targetLawId: lawId,
          type: 'Law',
        };
      }

      return { valid: false, error: 'At least one of lawId, articleId, or referenceId is required' };
    } catch (error) {
      return { valid: false, error: 'Validation error occurred' };
    }
  }

  async create(): Promise<unknown> {
    try {
      const createData = this.data as CreateReferenceInterface;
      const { lawId, articleId, referenceId, title, citation, url, notes } = createData;

      // Validate target and get type
      const validation = await this.validateTarget(lawId, articleId, referenceId);

      if (!validation.valid) {
        return ResponseService({
          data: null,
          status: validation.error === 'Reference not found' || 
                  validation.error === 'Article not found' || 
                  validation.error === 'Law not found' ? 404 : 400,
          success: false,
          message: validation.error,
          res: this.res,
        });
      }

      const reference = await Database.Reference.create({
        lawId: validation.targetLawId!,
        articleId: articleId || null,
        parentReferenceId: referenceId || null,
        userId: this.userId || null,
        type: validation.type!,
        title,
        citation: citation || null,
        url: url || null,
        notes: notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return ResponseService({
        data: reference,
        status: 201,
        success: true,
        message: 'Reference successfully created',
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
      // Build where clause based on filters
      const whereClause: {
        lawId?: string;
        articleId?: string | null;
        parentReferenceId?: string | null;
        type?: ReferenceType;
      } = {};

      // If filtering by referenceId, get commentaries
      if (this.filters?.referenceId) {
        whereClause.parentReferenceId = this.filters.referenceId;
      }
      // If filtering by articleId, get article references
      else if (this.filters?.articleId) {
        whereClause.articleId = this.filters.articleId;
      }
      // If filtering by lawId, get law references (not on articles)
      else if (this.filters?.lawId) {
        whereClause.lawId = this.filters.lawId;
        whereClause.articleId = null;
        whereClause.parentReferenceId = null;
      }

      // Additional type filter
      if (this.filters?.type) {
        whereClause.type = this.filters.type;
      }

      const references = await Database.Reference.findAll({
        where: whereClause,
        include: [
          {
            model: Database.Law,
            as: 'law',
            attributes: ['id', 'lawNumber', 'title'],
          },
          {
            model: Database.Article,
            as: 'article',
            attributes: ['id', 'articleNumber', 'title'],
            required: false,
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id'],
            required: false,
          },
          {
            model: Database.Reference,
            as: 'parentReference',
            attributes: ['id', 'title', 'type'],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (!references || references.length === 0) {
        return ResponseService<GetAllReferences[]>({
          data: [],
          status: 200,
          success: true,
          message: 'No references found',
          res: this.res,
        });
      }

      return ResponseService({
        data: references,
        status: 200,
        message: 'References successfully retrieved',
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
      const reference = await Database.Reference.findOne({
        where: { id: this.dataId },
        include: [
          {
            model: Database.Law,
            as: 'law',
            attributes: ['id', 'lawNumber', 'title'],
          },
          {
            model: Database.Article,
            as: 'article',
            attributes: ['id', 'articleNumber', 'title'],
            required: false,
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id'],
            required: false,
          },
          {
            model: Database.Reference,
            as: 'parentReference',
            attributes: ['id', 'title', 'type'],
            required: false,
          },
        ],
      });

      if (!reference) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Reference not found',
          res: this.res,
        });
      }

      return ResponseService({
        data: reference,
        status: 200,
        message: 'Reference successfully retrieved',
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
      const reference = await Database.Reference.findOne({
        where: { id: this.dataId },
        raw: true,
      });

      if (!reference) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Reference not found',
          res: this.res,
        });
      }

      const updateData: Partial<UpdateReferenceInterface> = { ...(this.data as UpdateReferenceInterface) };

      const updatedReference = await Database.Reference.update(
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { where: { id: this.dataId } },
      );

      return ResponseService({
        data: updatedReference,
        success: true,
        status: 200,
        message: 'Reference successfully updated',
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
      const reference = await Database.Reference.findOne({
        where: { id: this.dataId },
        raw: true,
      });

      if (!reference) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Reference not found',
          res: this.res,
        });
      }

      const deletedReference = await Database.Reference.destroy({
        where: { id: this.dataId },
      });

      return ResponseService({
        data: deletedReference,
        success: true,
        status: 200,
        message: 'Reference successfully deleted',
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
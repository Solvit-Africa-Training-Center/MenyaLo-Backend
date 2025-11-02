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
  lawId: string;
  res: Response;
  filters?: {
    type?: ReferenceType;
  };

  constructor(
    data: ReferenceInterface | CreateReferenceInterface | UpdateReferenceInterface,
    dataId: string,
    lawId: string,
    res: Response,
    filters?: {
      type?: ReferenceType;
    },
  ) {
    this.data = data;
    this.dataId = dataId;
    this.lawId = lawId;
    this.res = res;
    this.filters = filters;
  }

  private async lawExists(): Promise<{ exists: boolean; error?: unknown }> {
    try {
      const law = await Database.Law.findOne({ where: { id: this.lawId }, raw: true });
      if (!law) {
        return { exists: false };
      } else {
        return { exists: true };
      }
    } catch (error) {
      return { exists: false, error };
    }
  }

  private async referenceExists(): Promise<{ exists: boolean; error?: unknown }> {
    try {
      const reference = await Database.Reference.findOne({
        where: { id: this.dataId, lawId: this.lawId },
        raw: true,
      });
      if (!reference) {
        return { exists: false };
      } else {
        return { exists: true };
      }
    } catch (error) {
      return { exists: false, error };
    }
  }

  async create(): Promise<unknown> {
    try {
      const { type, title, citation, url, notes } = this.data as CreateReferenceInterface;

      // Validate law exists
      const lawCheck = await this.lawExists();
      if (lawCheck.error) {
        const { message, stack } = lawCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!lawCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Law not found',
          res: this.res,
        });
      }

      const reference = await Database.Reference.create({
        lawId: this.lawId,
        type,
        title,
        citation,
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
      // Validate law exists
      const lawCheck = await this.lawExists();
      if (lawCheck.error) {
        const { message, stack } = lawCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!lawCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Law not found',
          res: this.res,
        });
      }

      // Build where clause
      const whereClause: {
        lawId: string;
        type?: ReferenceType;
      } = {
        lawId: this.lawId,
      };

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
      const lawCheck = await this.lawExists();
      if (lawCheck.error) {
        const { message, stack } = lawCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!lawCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Law not found',
          res: this.res,
        });
      }

      const referenceCheck = await this.referenceExists();
      if (referenceCheck.error) {
        const { message, stack } = referenceCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!referenceCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Reference not found',
          res: this.res,
        });
      }

      const reference = await Database.Reference.findOne({
        where: { id: this.dataId, lawId: this.lawId },
        include: [
          {
            model: Database.Law,
            as: 'law',
            attributes: ['id', 'lawNumber', 'title'],
          },
        ],
      });

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
      const lawCheck = await this.lawExists();
      if (lawCheck.error) {
        const { message, stack } = lawCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!lawCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Law not found',
          res: this.res,
        });
      }

      const referenceCheck = await this.referenceExists();
      if (referenceCheck.error) {
        const { message, stack } = referenceCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!referenceCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Reference not found',
          res: this.res,
        });
      }

      const updateData: UpdateReferenceInterface = { ...this.data };

      const updatedReference = await Database.Reference.update(
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { where: { id: this.dataId, lawId: this.lawId } },
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
      const lawCheck = await this.lawExists();
      if (lawCheck.error) {
        const { message, stack } = lawCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!lawCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Law not found',
          res: this.res,
        });
      }

      const referenceCheck = await this.referenceExists();
      if (referenceCheck.error) {
        const { message, stack } = referenceCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!referenceCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Reference not found',
          res: this.res,
        });
      }

      const deletedReference = await Database.Reference.destroy({
        where: { id: this.dataId, lawId: this.lawId },
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
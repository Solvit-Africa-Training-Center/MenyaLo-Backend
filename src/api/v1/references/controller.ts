import { Response } from 'express';
import { ReferenceService } from './service';
import { ReferenceRequestInterface, UpdateReferenceRequestInterface } from './references';

export class ReferenceController {
  // Create reference (public - no auth required)
  public async createReference(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const referenceService = new ReferenceService(req.body, '', res, undefined, userId);
      referenceService.create();
    } catch (error) {
      throw error as Error;
    }
  }

  // Get all references (public - no auth required)
  public async getAllReferences(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const filters = {
        lawId: req.query?.lawId,
        articleId: req.query?.articleId,
        referenceId: req.query?.referenceId,
        type: req.query?.type,
      };
      const referenceService = new ReferenceService(req.body, '', res, filters);
      referenceService.findAll();
    } catch (error) {
      throw error as Error;
    }
  }

  // Get single reference (public - no auth required)
  public async getReference(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const referenceService = new ReferenceService(req.body, id!, res);
      referenceService.findOne();
    } catch (error) {
      throw error as Error;
    }
  }

  // Update reference (auth required)
  public async updateReference(
    req: UpdateReferenceRequestInterface,
    res: Response,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const referenceService = new ReferenceService(req.body, id, res);
      referenceService.update();
    } catch (error) {
      throw error as Error;
    }
  }

  // Delete reference (auth required)
  public async deleteReference(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const referenceService = new ReferenceService(req.body, id!, res);
      referenceService.delete();
    } catch (error) {
      throw error as Error;
    }
  }
}
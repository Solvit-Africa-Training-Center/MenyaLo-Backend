import { Response } from 'express';
import { ReferenceService } from './service';
import { ReferenceRequestInterface, UpdateReferenceRequestInterface } from './references';

export class ReferenceController {
  public async createReference(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const { lawId } = req.params;
      const referenceService = new ReferenceService(req.body, '', lawId, res);
      referenceService.create();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAllReferences(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const { lawId } = req.params;
      const filters = {
        type: req.query?.type,
      };
      const referenceService = new ReferenceService(req.body, '', lawId, res, filters);
      referenceService.findAll();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getReference(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const { lawId, id } = req.params;
      const referenceService = new ReferenceService(req.body, id, lawId, res);
      referenceService.findOne();
    } catch (error) {
      throw error as Error;
    }
  }

  public async updateReference(
    req: UpdateReferenceRequestInterface,
    res: Response,
  ): Promise<void> {
    try {
      const { lawId, id } = req.params;
      const referenceService = new ReferenceService(req.body, id, lawId, res);
      referenceService.update();
    } catch (error) {
      throw error as Error;
    }
  }

  public async deleteReference(req: ReferenceRequestInterface, res: Response): Promise<void> {
    try {
      const { lawId, id } = req.params;
      const referenceService = new ReferenceService(req.body, id, lawId, res);
      referenceService.delete();
    } catch (error) {
      throw error as Error;
    }
  }
}
import { Response } from 'express';
import { IRequestUser } from '../../../../middleware/unifiedAuthMiddleware';

export const googleCallBack = (req: IRequestUser, res: Response): void => {
  try {
    const token = req.token as string;
    const frontendUrl = 'http://localhost:5173';
    res.redirect(`${frontendUrl}/feed#token=${token}`);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (error) {
    const frontendUrl = 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};

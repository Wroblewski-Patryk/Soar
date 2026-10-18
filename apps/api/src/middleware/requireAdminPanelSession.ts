import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiError';

export const requireAdminPanelSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.authSource !== 'cookie') {
    return sendError(res, 403, 'Administrator panel session required');
  }
  return next();
};

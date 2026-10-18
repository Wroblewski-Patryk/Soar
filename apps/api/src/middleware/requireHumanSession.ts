import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiError';

export const requireHumanSession = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.authKind !== 'human' ||
    req.authSource !== 'cookie' ||
    req.headers.authorization !== undefined
  ) {
    return sendError(res, 403, 'Human browser session required');
  }
  return next();
};

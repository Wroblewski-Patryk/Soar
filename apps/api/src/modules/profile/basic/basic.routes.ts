
import { Router } from 'express';
import * as controller from './basic.controller';
import { accountDeleteLimiter } from '../security/security.routes';
import { requireHumanSession } from '../../../middleware/requireHumanSession';

const basicRouter = Router();

basicRouter.route('/')
  .get(controller.getProfile)
  .patch(requireHumanSession, controller.updateProfile)
  .delete(requireHumanSession, accountDeleteLimiter, controller.deleteUser);

export default basicRouter;

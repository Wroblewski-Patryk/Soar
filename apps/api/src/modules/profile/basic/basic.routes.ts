
import { Router } from 'express';
import * as controller from './basic.controller';
import { accountDeleteLimiter } from '../security/security.routes';

const basicRouter = Router();

basicRouter.route('/')
  .get(controller.getProfile)
  .patch(controller.updateProfile)
  .delete(accountDeleteLimiter, controller.deleteUser);

export default basicRouter;

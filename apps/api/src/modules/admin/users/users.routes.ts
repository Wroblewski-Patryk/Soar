import { Router } from 'express';
import * as controller from './users.controller';
import { requireAdminPanelSession } from '../../../middleware/requireAdminPanelSession';

const usersRouter = Router();

usersRouter.get('/', controller.listUsers);
usersRouter.patch('/:userId', requireAdminPanelSession, controller.updateUser);

export default usersRouter;


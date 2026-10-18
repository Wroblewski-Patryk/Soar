import { Router } from 'express';
import * as controller from './subscriptionPlans.controller';
import { requireAdminPanelSession } from '../../../middleware/requireAdminPanelSession';

const subscriptionPlansRouter = Router();

subscriptionPlansRouter.get('/', controller.listSubscriptionPlans);
subscriptionPlansRouter.put('/:code', requireAdminPanelSession, controller.updateSubscriptionPlan);

export default subscriptionPlansRouter;

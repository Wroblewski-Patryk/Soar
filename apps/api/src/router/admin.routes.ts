import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { requireHumanSession } from '../middleware/requireHumanSession';
import subscriptionPlansRouter from '../modules/admin/subscriptionPlans/subscriptionPlans.routes';
import usersRouter from '../modules/admin/users/users.routes';
import liveExecutionRouter from '../modules/admin/liveExecution/liveExecution.routes';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));
router.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  return requireHumanSession(req, res, next);
});
router.use('/subscriptions/plans', subscriptionPlansRouter);
router.use('/users', usersRouter);
router.use('/live-execution', liveExecutionRouter);

router.get('/', (req, res) => {
  res.json({ message: 'Panel admina, widoczny tylko dla admina!' });
});

export default router;

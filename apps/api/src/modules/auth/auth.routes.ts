import { Router } from 'express';
import { register, me, login, logout } from './auth.controller';
import { createRateLimiter } from '../../middleware/rateLimit';

const router = Router();
const authIpLimiter = createRateLimiter({ windowMs: 60_000, max: 80, keyScope: 'ip' });
const authLimiter = createRateLimiter({ windowMs: 60_000, max: 20, keyScope: 'auth' });
const loginIpLimiter = createRateLimiter({ windowMs: 60_000, max: 30, keyScope: 'ip' });
const loginLimiter = createRateLimiter({ windowMs: 60_000, max: 10, keyScope: 'auth' });

router.post('/register', authIpLimiter, authLimiter, register);
router.get('/me', authLimiter, me);
router.post('/login', loginIpLimiter, loginLimiter, login);
router.post('/logout', authLimiter, logout);
export default router;

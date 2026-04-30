import { Router } from 'express';
import { createRateLimiter } from '../../middleware/rateLimit';
import {
  createWallet,
  deleteWallet,
  getWallet,
  getWalletCashflowEvents,
  getWalletEquityTimeline,
  getWalletPerformanceSummary,
  listWalletMetadata,
  listWallets,
  previewBalance,
  resetPaperWallet,
  updateWallet,
} from './wallets.controller';

const walletsRouter = Router();
const walletReadLimiter = createRateLimiter({ windowMs: 60_000, max: 120 });
const walletWriteLimiter = createRateLimiter({ windowMs: 60_000, max: 40 });
const walletPreviewLimiter = createRateLimiter({ windowMs: 60_000, max: 20, keyScope: 'user_exchange' });

walletsRouter.get('/', walletReadLimiter, listWallets);
walletsRouter.get('/metadata', walletReadLimiter, listWalletMetadata);
walletsRouter.post('/preview-balance', walletPreviewLimiter, previewBalance);
walletsRouter.get('/:id/performance-summary', walletReadLimiter, getWalletPerformanceSummary);
walletsRouter.get('/:id/equity-timeline', walletReadLimiter, getWalletEquityTimeline);
walletsRouter.get('/:id/cashflow-events', walletReadLimiter, getWalletCashflowEvents);
walletsRouter.get('/:id', walletReadLimiter, getWallet);
walletsRouter.post('/', walletWriteLimiter, createWallet);
walletsRouter.put('/:id', walletWriteLimiter, updateWallet);
walletsRouter.post('/:id/reset-paper', walletWriteLimiter, resetPaperWallet);
walletsRouter.delete('/:id', walletWriteLimiter, deleteWallet);

export default walletsRouter;

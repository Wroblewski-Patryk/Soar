import { Request, Response } from 'express';
import { sendError } from '../../utils/apiError';
import { sendValidationError } from '../../utils/formatZodError';
import { ExchangeNotImplementedError } from '../exchange/exchangeCapabilities';
import { ZodError } from 'zod';
import {
  CreateBacktestRunSchema,
  GetBacktestTimelineQuerySchema,
  ListBacktestRunsQuerySchema,
  ListBacktestTradesQuerySchema,
} from './backtests.types';
import * as backtestsService from './backtests.service';
import { BacktestTimelineSourceError } from './backtestIntrabarTimelineSource';

export const listBacktestRuns = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  try {
    const query = ListBacktestRunsQuerySchema.parse(req.query);
    const runs = await backtestsService.listRuns(userId, query);
    return res.json(runs);
  } catch (error) {
    return sendValidationError(res, error);
  }
};

export const getBacktestRun = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  const { id } = req.params;
  const run = await backtestsService.getRun(userId, id);
  if (!run) return sendError(res, 404, 'Not found');

  return res.json(run);
};

export const createBacktestRun = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  try {
    const payload = CreateBacktestRunSchema.parse(req.body);
    const created = await backtestsService.createRun(userId, payload);
    if (!created) return sendError(res, 404, 'Strategy or market universe not found');
    return res.status(201).json(created);
  } catch (error) {
    if (error instanceof ExchangeNotImplementedError) {
      return sendError(res, error.status, error.message, error.toDetails());
    }
    if (error instanceof backtestsService.BacktestRunValidationError) {
      return sendError(res, 400, error.message);
    }
    if (error instanceof backtestsService.BacktestQueueUnavailableError) {
      return sendError(res, 503, error.message, { runId: error.runId, recovery: 'pending' });
    }
    if (error instanceof ZodError) return sendValidationError(res, error);
    return sendError(res, 500, 'Backtest creation failed');
  }
};

export const deleteBacktestRun = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  const { id } = req.params;
  const deleted = await backtestsService.deleteRun(userId, id);
  if (!deleted) return sendError(res, 404, 'Not found');

  return res.status(204).end();
};

export const listBacktestRunTrades = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  try {
    const query = ListBacktestTradesQuerySchema.parse(req.query);
    const trades = await backtestsService.listRunTrades(userId, req.params.id, query);
    if (!trades) return sendError(res, 404, 'Not found');
    return res.json(trades);
  } catch (error) {
    return sendValidationError(res, error);
  }
};

export const getBacktestRunReport = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  const report = await backtestsService.getRunReport(userId, req.params.id);
  if (typeof report === 'undefined') return sendError(res, 404, 'Not found');

  return res.json(report);
};

export const getBacktestRunTimeline = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendError(res, 401, 'Unauthorized');

  try {
    const query = GetBacktestTimelineQuerySchema.parse(req.query);
    const timeline = await backtestsService.getRunTimeline(userId, req.params.id, query);
    if (!timeline) return sendError(res, 404, 'Not found');
    return res.json(timeline);
  } catch (error) {
    if (error instanceof BacktestTimelineSourceError)
      return sendError(res, 409, error.message, { code: error.code });
    return sendValidationError(res, error);
  }
};

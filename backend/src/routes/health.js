import { Router } from 'express';
import { checkDb } from '../db.js';
import { checkStorage } from '../storage.js';

export const healthRouter = Router();

// GET /api/v1/health  (openapi.yaml: getHealth).
healthRouter.get('/', async (_req, res) => {
  const [db, storage] = await Promise.allSettled([checkDb(), checkStorage()]);
  const body = {
    status: db.status === 'fulfilled' && storage.status === 'fulfilled' ? 'ok' : 'degraded',
    database: db.status === 'fulfilled' ? 'up' : 'down',
    storage: storage.status === 'fulfilled' ? 'up' : 'down',
  };
  res.status(body.status === 'ok' ? 200 : 503).json(body);
});
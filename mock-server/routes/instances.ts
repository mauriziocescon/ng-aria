import type { Request, Response } from 'express';
import express from 'express';

import { mocks } from '../db/index.ts';

export const router = express.Router();

router.get('/instances', (req: Request, res: Response) => {
  const textSearch = String(req.query.q ?? '').toLocaleLowerCase();
  const start = parseInt(req.query._start as string) || 0;
  const limit = parseInt(req.query._limit as string) || 20;

  const instances = mocks.instances
    .filter(inst => {
      const searchStr = typeof textSearch === 'string' ? textSearch : '';
      return textSearch === undefined ||
        textSearch === '' ||
        JSON.stringify(inst).toLowerCase().includes(searchStr.toLowerCase());
    })
    .slice(start, start + limit);

  // set the number of tasks (unfiltered total)
  res.setHeader('X-Total-Count', mocks.instances.length);

  return res.status(200).json(instances);
});

import express from 'express';

import { getDb } from '../lowdb.ts';

export const router = express.Router();

router.get('/instances', (req, res) => {
  const db = getDb();
  const textSearch = req.query.q;
  const start = parseInt(req.query._start as string) || 0;
  const limit = parseInt(req.query._limit as string) || 20;

  const instances = db.get('instances')
    .filter(inst => {
      const searchStr = typeof textSearch === 'string' ? textSearch : '';
      return textSearch === undefined ||
        textSearch === '' ||
        JSON.stringify(inst).toLowerCase().includes(searchStr.toLowerCase());
    })
    .slice(start, start + limit)
    .value();

  // set the number of tasks
  res.setHeader('X-Total-Count', db.get('instances').value().length);

  return res.status(200).jsonp(instances);
});

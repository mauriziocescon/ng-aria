import express from 'express';

import { getDb } from '../lowdb.ts';
import type { Block, Instance } from '../types/types.ts';
import { validate } from '../utils/validation.ts';

export const router = express.Router();

router.get('/blocks', (req, res) => {
  const db = getDb();
  const instanceId = req.query.instanceId;

  const foundInstance = db.get('instances')
    .find({ id: instanceId } as any)
    .value() as Instance | undefined;

  if (foundInstance) {
    return res.status(200).jsonp(foundInstance.blocks);
  } else {
    return res.status(400).jsonp({
      error: 'Bad Request',
    });
  }
});

router.put('/blocks', (req, res) => {
  const db = getDb();
  const instanceId = req.body.instanceId;
  const newBlocks = req.body.blocks;

  const foundInstance = db.get('instances')
    .find({ id: instanceId } as any)
    .value() as Instance | undefined;

  if (foundInstance) {
    const currentBlocks = foundInstance.blocks;

    let blocksMap: { [key: string]: Block } = {};
    currentBlocks.forEach((block: Block) => blocksMap[block.id] = block);
    newBlocks.forEach((block: Block) => blocksMap[block.id] = block);
    let blocks = Object.keys(blocksMap).map(key => blocksMap[key]);
    blocks = blocks.sort((b1, b2) => {
      return b1.order - b2.order;
    });

    blocks = validate(blocks);

    db.get('instances')
      .find({ id: instanceId } as any)
      .assign({ blocks: blocks })
      .write();

    return res.status(200).jsonp(blocks);
  } else {
    return res.status(400).jsonp({
      error: 'Bad Request',
    });
  }
});

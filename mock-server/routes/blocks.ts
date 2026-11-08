import type { Request, Response } from 'express';
import express from 'express';

import { mocks } from '../db/index.ts';
import type { Block } from '../types/types.ts';
import { validate } from '../utils/validation.ts';

export const router = express.Router();

router.get('/blocks', (req: Request, res: Response) => {
  const instanceId = req.query.instanceId;

  const foundInstance = mocks.instances.find(inst => inst.id === instanceId);

  if (foundInstance) {
    return res.status(200).json(foundInstance.blocks);
  } else {
    return res.status(400).json({
      error: 'Bad Request',
    });
  }
});

router.put('/blocks', (req: Request, res: Response) => {
  const instanceId = req.body.instanceId;
  const newBlocks = req.body.blocks;

  const foundInstance = mocks.instances.find(inst => inst.id === instanceId);

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

    foundInstance.blocks = blocks;

    return res.status(200).json(blocks);
  } else {
    return res.status(400).json({
      error: 'Bad Request',
    });
  }
});

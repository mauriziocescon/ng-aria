import path from 'node:path';
import cors from 'cors';
import express from 'express';

import { delay } from './middlewares/delay.ts';
import { error } from './middlewares/errors.ts';

import * as blocks from './routes/blocks.ts';
import * as instances from './routes/instances.ts';

const isProduction = process.env.NODE_ENV === 'production';

const port = process.env.PORT || 3000;

// Built frontend (resolved from the cwd, i.e. the project root)
const browserDist = path.resolve('dist/ng-aria/browser');

// API router: everything API-related lives here, so static assets and
// SPA navigations never go through the simulated delay / errors.
const api = express.Router();

// Enable CORS and expose the custom pagination header so cross-origin dev
// requests (ng serve on :4200 -> mock server on :3000) can read X-Total-Count.
api.use(cors({ exposedHeaders: ['X-Total-Count'] }));

// Simulated network conditions (dev-only)
if (!isProduction) {
  api.use(delay);
  api.use(error);
}

// To handle POST, PUT and PATCH you need body parsing
api.use(express.json());

api.use(instances.router, blocks.router);

// Unknown API endpoints get a JSON 404 (never the SPA shell)
api.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const app = express();

if (isProduction) {
  app.use('/api', api);
  app.use(express.static(browserDist));

  // SPA fallback: any other GET gets index.html (frontend handles routing)
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(browserDist, 'index.html'));
  });
} else {
  app.use(api);
}

app.listen(port, () => {
  console.log(`Mock server is running! Open the browser at http://localhost:${port}`);
});

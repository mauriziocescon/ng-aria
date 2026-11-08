import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import { delay } from './middlewares/delay.ts';
import { error } from './middlewares/errors.ts';

// routes
import * as blocks from './routes/blocks.ts';
import * as instances from './routes/instances.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// set the port of our application
const port = process.env.PORT || 3000;

// Serve the built frontend in production
if (isProduction) {
  app.use(express.static('./dist/ng-aria/browser'));

  // Serve the SPA shell for client-side routes before delay/error so that
  // deep-link/full-page navigations are not subject to the random delay/error
  // injection (just like static assets already aren't). API traffic (/api/*)
  // must fall through to the route handlers.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    // load index.html (frontend will handle page changes)
    res.sendFile(path.join(__dirname, '../dist/ng-aria/browser/index.html'));
  });
}

// Enable CORS and expose the custom pagination header so cross-origin dev
// requests (ng serve on :4200 -> mock server on :3000) can read X-Total-Count.
app.use(cors({ exposedHeaders: ['X-Total-Count'] }));

// Middlewares (run before body parsing and routes)
app.use(delay);
app.use(error);

// To handle POST, PUT and PATCH you need body parsing
app.use(express.json());

// Mount routes
app.use(`${isProduction ? '/api' : '/'}`, instances.router);
app.use(`${isProduction ? '/api' : '/'}`, blocks.router);

// Start listening
app.listen(port, () => {
  console.log(`Mock server is running! Open the browser at http://localhost:${port}`);
});

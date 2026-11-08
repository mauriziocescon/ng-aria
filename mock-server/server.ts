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
// process.env.PORT lets the port to be set by Heroku
const port = process.env.PORT || 3000;

// Serve the built frontend in production
if (isProduction) {
  app.use(express.static('./dist/ng-aria/browser'));
}

// Enable CORS and expose the custom pagination header so cross-origin dev
// requests (ng serve on :4200 -> mock server on :3000) can read X-Total-Count.
app.use(cors({ exposedHeaders: ['X-Total-Count'] }));

// Middlewares (run before body parsing and routes, as before)
app.use(delay);
app.use(error);

// To handle POST, PUT and PATCH you need to use a body-parser
app.use(express.json());

// Mount routes
app.use(`${isProduction ? '/api' : '/'}`, instances.router);
app.use(`${isProduction ? '/api' : '/'}`, blocks.router);

// Fallback on frontend routes
app.use((req: Request, res: Response, next: NextFunction) => {
  // load index.html (frontend will handle page changes)
  isProduction ? res.sendFile(path.join(__dirname, '../dist/ng-aria/browser/index.html')) : next();
});

// Start listening
app.listen(port, () => {
  console.log(`Mock server is running! Open the browser at http://localhost:${port}`);
});

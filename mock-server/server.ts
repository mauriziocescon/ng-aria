import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jsonServer from 'json-server';
import type { NextFunction, Request, Response } from 'express';
import { getRouter } from './lowdb.ts';

import { delay } from './middlewares/delay.ts';
import { error } from './middlewares/errors.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const app = jsonServer.create();
const router = getRouter();
const middlewares = jsonServer.defaults(isProduction ? { static: './dist/ng-material/browser' } : {});

// set the port of our application
// process.env.PORT lets the port to be set by Heroku
const port = process.env.PORT || 3000;

// Middlewares
app.use(middlewares);
app.use(delay);
app.use(error);

// To handle POST, PUT and PATCH you need to use a body-parser
app.use(jsonServer.bodyParser);

// Rewrite some routes
app.use(jsonServer.rewriter({}));

// Mount routes
app.use(`${isProduction ? '/api' : '/'}`, router);

// Fallback on frontend routes
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  // load index.html (frontend will handle page changes)
  isProduction ? res.sendFile(path.join(__dirname, '../dist/ng-material/browser/index.html')) : next();
});

// Start listening
app.listen(port, () => {
  console.log(`JSON Server is running! Open the browser at http://localhost:${port}`);
});

import koa from 'koa';
import koaMount from 'koa-mount';

import tokenCheckerMiddleware from './lib/middlewares/tokenChecker';

import authenticateAdminRoutes from './authentication/authenticateAdminRoutes';

const app = koa();

app.use(koaMount('/authenticate', authenticateAdminRoutes));
app.use(tokenCheckerMiddleware);

export default app;

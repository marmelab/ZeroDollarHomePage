import koa from 'koa';
import koaMount from 'koa-mount';
import koaRoute from 'koa-route';

import authenticateApiRoutes from './authentication/authenticateApiRoutes';
import methodFilter from './lib/middlewares/methodFilter';

const app = koa();

app.use(koaMount('/', authenticateApiRoutes));


app.use(methodFilter(['GET']));
app.use(koaRoute.get('/', function* primaryEntryPoint() {
    this.status = 200;
    this.body = {status: 'ok'};
}));

export default app;

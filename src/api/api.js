import koa from 'koa';
import koaMount from 'koa-mount';
import koaRoute from 'koa-route';

import oauthProxy from './authentication/oauthProxy';
import authenticateApiRoutes from './authentication/authenticateApiRoutes';
import claimsApiRoutes from './claims/claimsApiRoutes';
import methodFilter from './lib/middlewares/methodFilter';

const app = koa();

app.use(koaMount('/oauthproxy', oauthProxy));
app.use(koaMount('/', authenticateApiRoutes));
app.use(koaMount('/claims', claimsApiRoutes));


app.use(methodFilter(['GET']));
app.use(koaRoute.get('/', function* primaryEntryPoint() {
    this.status = 200;
    this.body = {status: 'ok'};
}));

export default app;

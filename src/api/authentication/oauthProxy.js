import oauthshim from 'oauth-shim';
import config from 'config';
import koa from 'koa';
import koaRoute from 'koa-route';
import koaConnect from 'koa-connect';

const app = koa();

app.use(koaRoute.all('/', koaConnect(oauthshim)));

oauthshim.init([{
    name: 'github',
    domain: config.oauth.domain,
    client_id: config.oauth.githubClientId,
    client_secret: config.oauth.githubClientSecret,
    grant_url: 'https://github.com/login/oauth/access_token',
}]);

export default app;

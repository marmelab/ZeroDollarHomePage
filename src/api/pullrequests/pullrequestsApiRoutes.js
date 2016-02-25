import config from 'config';
import koa from 'koa';
import koaRoute from 'koa-route';
import methodFilter from '../lib/middlewares/methodFilter';
import githubApiFactory from '../github/githubApi';

const app = koa();

app.use(methodFilter(['GET']));

app.use(koaRoute.get('/:repository/:pullRequestNumber', function* loadPullRequest(repository, pullRequestNumber) {
    const githubApi = githubApiFactory(config.apps.api);

    this.body = yield githubApi.loadPullRequest(repository, pullRequestNumber);
}));

export default app;

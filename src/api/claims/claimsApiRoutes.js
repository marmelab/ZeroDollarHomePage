import busboyParse from 'co-busboy';
import config from 'config';
import koa from 'koa';
import koaRoute from 'koa-route';
import methodFilter from '../lib/middlewares/methodFilter';
import githubApiFactory from '../github/githubApi';
import saveFileFactory from './uploadToS3';
import newRequestFactory from '../../isomorphic/newRequest';

const app = koa();
const saveFile = saveFileFactory(config.apps.api.s3);
const newRequest = newRequestFactory(config.eris);

let githubApi;

app.use(methodFilter(['GET', 'POST']));

app.use(function* (next) {
    githubApi = githubApiFactory(config.apps.api);

    yield next;
});

app.use(koaRoute.get('/:repository/:pullRequestNumber', function* loadPullRequest(repository, pullRequestNumber) {
    this.body = yield githubApi.loadPullRequest(repository, pullRequestNumber);
}));

app.use(koaRoute.post('/:repository/:pullRequestNumber', function* loadPullRequest(repository, pullRequestNumber) {
    const pullrequest = yield githubApi.loadPullRequest(repository, pullRequestNumber);

    if (!pullrequest) {
        return this.throws(404);
    }

    const parts = busboyParse(this, {
        autoFields: true,
    });

    let imageUrl;
    let file;
    while ((file = yield parts)) {
        imageUrl = yield saveFile(`${pullrequest.id}.mp4`, file);
    }

    const timeBeforeDisplay = yield newRequest(pullrequest.id, pullrequest.user.login, imageUrl);

    this.body = { timeBeforeDisplay };
}));

export default app;

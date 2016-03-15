import busboyParse from 'co-busboy';
import config from 'config';
import koa from 'koa';
import koaRoute from 'koa-route';
import path from 'path';

import methodFilter from '../lib/middlewares/methodFilter';
import getBufferFromImageStream from '../lib/getBufferFromImageStream';
import githubApiFactory from '../github/githubApi';
import isSafeImageFactory from '../vision/isSafeImage';
import saveFileFactory from '../lib/s3/uploadToS3';
import getRequestFactory from '../../isomorphic/getRequest';
import newRequestFactory from '../../isomorphic/newRequest';

const app = koa();
const saveFile = saveFileFactory(config.apps.api.s3);
const getRequest = getRequestFactory(config.blockchain);
const newRequest = newRequestFactory(config.blockchain);
const isSafeImage = isSafeImageFactory(config.apps.api.vision);

app.use(methodFilter(['GET', 'POST']));

app.use(koaRoute.get('/:repository/:pullRequestNumber', function* loadPullRequest(repository, pullRequestNumber) {
    const githubApi = githubApiFactory(config.apps.api.github);
    this.body = yield githubApi.loadPullRequest(repository, pullRequestNumber);
}));

app.use(koaRoute.post('/:repository/:pullRequestNumber', function* loadPullRequest(repository, pullRequestNumber) {
    const parts = busboyParse(this, {
        checkField: (name, value) => {
            if (name === 'githubAccessToken' && !value) {
                return new Error(401);
            }
        },
        checkFile: (fieldname, file, filename) => {
            if (path.extname(filename) !== '.jpg') {
                return new Error(400, 'Invalid jpg image');
            }
        },
    });

    let imageAsBuffer;
    let pullrequest;
    let part;
    while ((part = yield parts)) { // eslint-disable-line no-cond-assign
        if (part.length) {
            const [name, value] = part;
            if (name === 'githubAccessToken') {
                if (!value) return this.throw(401);

                const githubApi = githubApiFactory(value);
                const user = yield githubApi.loadUser();
                pullrequest = yield githubApi.loadPullRequest(repository, pullRequestNumber);

                if (!pullrequest) return this.throw(404);

                if (pullrequest.user.login !== user.login) return this.throw(401);
            }
        } else {
            imageAsBuffer = yield getBufferFromImageStream(part);

            let isImageSafe = !config.apps.api.vision.enabled;

            if (config.apps.api.vision.enabled) {
                isImageSafe = yield isSafeImage(imageAsBuffer);
            }

            if (!isImageSafe) {
                this.throw(401, 'This image is not suitable.');
            }
        }
    }

    yield newRequest(true, pullrequest.id, pullrequest.user.login);
    const timeBeforeDisplay = yield getRequest(false, pullrequest.id);

    if (timeBeforeDisplay <= 0) this.throw(500, 'An error occured while claiming this pull request');

    yield saveFile(`${pullrequest.id}.jpg`, imageAsBuffer);

    this.body = { timeBeforeDisplay };
}));

export default app;

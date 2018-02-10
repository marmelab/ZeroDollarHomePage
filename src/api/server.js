import config from 'config';
import path from 'path';
import koa from 'koa';
import koaCors from 'koa-cors';
import koaMount from 'koa-mount';
import koaHelmet from 'koa-helmet';
import compress from 'koa-compressor';

import dbClient from './lib/db/client';
import logger from './lib/logger';
import xdomainRoute from './lib/xdomainRoute';

import githubApiFactory from './github/githubApi';
import githubHook from 'githubhook';
import handlePullRequestEventFactory from './github/handlePullRequestEvent';
import initializeGithubHook from './github/initializeGithubHook';
import cronInitializer from './cron';

const env = process.env.NODE_ENV || 'development';
const port = config.apps.api.port;

const app = koa();
const appLogger = logger(config.apps.api.logs.app);
const httpLogger = logger(config.apps.api.logs.http);

// Server logs
app.use(function* logHttp(next) {
    this.logger = appLogger;

    this.httpLog = {
        method: this.request.method,
        remoteIP: this.request.ip,
        userAgent: this.request.headers['user-agent'],
        app: this.request.url.indexOf('/admin') === 0 ? 'admin' : 'api',
    };

    const sessionId = this.cookies.get('koa:sess');
    if (sessionId) {
        this.httpLog.sessionId = sessionId;
    }

    const authorization = this.get('authorization');
    if (authorization) {
        this.httpLog.authorization = authorization;
    }

    yield next;

    // Static files
    if (['.css', '.js', '.woff'].indexOf(path.extname(this.request.url)) !== -1) {
        return;
    }
    this.httpLog.status = this.status;
    httpLogger.log('info', this.request.url, this.httpLog);
});

// Error catching - override koa's undocumented error handler
app.context.onerror = function onError(err) {
    if (!err) return;

    this.status = err.status || 500;
    this.app.emit('error', err, this);

    if (this.headerSent || !this.writable) {
        err.headerSent = true;
        return;
    }
    const body = {
        error: err.message,
        code: err.code,
    };

    if (env === 'development') {
        body.stack = err.stack;
    }

    this.body = JSON.stringify(body);
    this.type = 'json';
    this.res.end(this.body);
};

// Error logging
app.on('error', (err, ctx = {}) => {
    const errorDetails = {
        status: ctx.status,
        error: err.message,
        stack: err.stack,
        err: err,
    };

    httpLogger.log('error', typeof ctx.request !== 'undefined' ? ctx.request.url : '', errorDetails);
});

// XmlHttpRequest shim for IE
app.use(xdomainRoute);

// Security headers
app.use(koaHelmet());
app.use(koaHelmet.csp({ directives: { defaultSrc: ["'self'"] } }));
app.use(koaHelmet.frameguard('deny'));
app.use(koaMount('/', koaCors({
    credentials: true,
    headers: [
        'Authorization',
        'Content-Disposition',
        'Content-Type',
        'X-Entities',
    ],
    methods: [
        'DELETE',
        'GET',
        'POST',
        'PUT',
    ],
    origin: (request) => {
        const origin = request.get('origin');

        if (!!origin.length && config.apps.api.allowOrigin.indexOf(origin) === -1) {
            return false;
        }

        return origin;
    },
})));

// DB connection
app.use(function* (next) {
    const pgConnection = yield dbClient(config.apps.api.db);
    this.client = pgConnection.client;

    try {
        yield next;
    } catch (err) {
        // Since there was an error somewhere down the middleware,
        // then we need to throw this client away.
        pgConnection.done(err);

        throw err;
    }

    pgConnection.done();
});

if (env !== 'development') {
    // gzip compression
    app.use(compress());
}

cronInitializer();

app.use(koaMount('/api', require('./api')));
app.use(koaMount('/admin', require('./admin')));

// Github hook initialization
initializeGithubHook(
    githubHook,
    config.apps.api,
    handlePullRequestEventFactory(githubApiFactory(config.apps.api.github), config.apps.api)
);

if (!module.parent || module.parent.filename.indexOf('api/index.js') !== -1) {
    app.listen(port);
    appLogger.info(`API server listening on port ${port}`);
    appLogger.info('Press CTRL+C to stop server');
}

export default app;

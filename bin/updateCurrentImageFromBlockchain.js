/* eslint-disable no-console */

import co from 'co';
import config from 'config';
import getLastNonPublishedFactory from '../src/isomorphic/getLastNonPublished';
import updateCurrentFileFactory from '../src/api/lib/s3/renameFileInS3';
import closeRequestFactory from '../src/isomorphic/closeRequest';
import { updateImageJob } from '../src/api/cron';

co(function* updateCurrentImageFromBlockchain() {
    const updateCurrentFile = updateCurrentFileFactory(config.apps.api.s3);
    const closeRequest = closeRequestFactory(config.blockchain);
    const getLastNonPublished = getLastNonPublishedFactory(config.blockchain);

    yield updateImageJob(closeRequest, getLastNonPublished, updateCurrentFile);
    process.exit();
}).catch(err => {
    console.error(err.message, {err: err.stack});
    process.exit();
});

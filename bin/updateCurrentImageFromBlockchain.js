/* eslint-disable vars-on-top */
/* eslint-disable no-var */
'use strict';

import co from 'co';
import config from 'config';
import getLastNonPublished from '../src/isomorphic/getLastNonPublished';
import updateCurrentFileFactory from '../src/api/lib/s3/renameFileInS3';
import closeRequest from '../src/isomorphic/closeRequest';
import { updateImageJob } from '../src/api/cron';

co(function* () {
    const updateCurrentFile = updateCurrentFileFactory(config.apps.api.s3);
    yield updateImageJob(closeRequest, getLastNonPublished, updateCurrentFile);
    process.exit();
}).catch(function(err) {
    console.error(err.message);
    process.exit();
});

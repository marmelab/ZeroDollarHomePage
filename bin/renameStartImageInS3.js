/* eslint-disable vars-on-top */
/* eslint-disable no-var */
'use strict';

import co from 'co';
import config from 'config';
import updateCurrentFileFactory from '../src/api/lib/s3/renameFileInS3';

const args = process.argv.slice(2);

co(function* () {
    yield updateCurrentFileFactory(config.apps.api.s3)(args[0]);
    process.exit();
}).catch(function(err) {
    console.error(err.message);
    process.exit();
});

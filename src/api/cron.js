import co from 'co';
import config from 'config';
import { scheduleJob } from 'node-schedule';
import getLastNonPublished from '../isomorphic/getLastNonPublished';
import updateCurrentFileFactory from '../lib/s3/renameFileInS3';

const updateCurrentFile = updateCurrentFileFactory(config.apps.api.s3);

export function* updateImageJob() {
    const result = yield getLastNonPublished();
    yield updateCurrentFile(result.imageUrl);
}

export default () => {
    if (config.apps.api.cron.enabled) {
        scheduleJob('update-image', config.apps.api.cron.schedule, co.wrap(updateImageJob));
    }
};

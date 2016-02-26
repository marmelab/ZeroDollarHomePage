import co from 'co';
import config from 'config';
import { scheduleJob } from 'node-schedule';
import getLastNonPublishedIsomorphic from '../isomorphic/getLastNonPublished';
import updateCurrentFileFactory from './lib/s3/renameFileInS3';

export function* updateImageJob(getLastNonPublished, updateCurrentFile) {
    const result = yield getLastNonPublished();

    if (result) {
        yield updateCurrentFile(result.imageUrl);
    }
}

export default () => {
    if (config.apps.api.cron.enabled) {
        const updateCurrentFile = updateCurrentFileFactory(config.apps.api.s3);
        scheduleJob('update-image', config.apps.api.cron.schedule, co.wrap(updateImageJob.bind(null, getLastNonPublishedIsomorphic, updateCurrentFile)));
    }
};

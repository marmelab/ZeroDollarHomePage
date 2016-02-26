import co from 'co';
import config from 'config';
import { scheduleJob } from 'node-schedule';
import getLastNonPublishedIsomorphic from '../isomorphic/getLastNonPublished';
import updateCurrentFileFactory from './lib/s3/renameFileInS3';
import closeRequestIsomorphic from '../isomorphic/closeRequest';

export function* updateImageJob(closeRequest, getLastNonPublished, updateCurrentFile) {
    yield closeRequest();

    const result = yield getLastNonPublished();
    if (!result) return;

    yield updateCurrentFile(result.imageUrl);
}

export default () => {
    if (config.apps.api.cron.enabled) {
        const updateCurrentFile = updateCurrentFileFactory(config.apps.api.s3);
        const job = updateImageJob.bind(null, closeRequestIsomorphic, getLastNonPublishedIsomorphic, updateCurrentFile);
        scheduleJob('update-image', config.apps.api.cron.schedule, co.wrap(job));
    }
};

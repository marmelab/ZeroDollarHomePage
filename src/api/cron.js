import co from 'co';
import config from 'config';
import { scheduleJob } from 'node-schedule';
import getLastNonPublishedFactory from '../isomorphic/getLastNonPublished';
import updateCurrentFileFactory from './lib/s3/renameFileInS3';
import closeRequestFactory from '../isomorphic/closeRequest';

export function* updateImageJob(closeRequest, getLastNonPublished, updateCurrentFile) {
    yield closeRequest(true);

    const result = yield getLastNonPublished();
    console.log({result});

    if (!result) {
        console.warn('Queue is empty'); // eslint-disable-line no-console
        return;
    }

    yield updateCurrentFile(`${result}.jpg`);
}

export default () => {
    if (config.apps.api.cron.enabled) {
        const updateCurrentFile = updateCurrentFileFactory(config.apps.api.s3);
        const closeRequest = closeRequestFactory(config.blockchain);
        const getLastNonPublished = getLastNonPublishedFactory(config.blockchain);

        const job = updateImageJob.bind(null, closeRequest, getLastNonPublished, updateCurrentFile);
        scheduleJob('update-image', config.apps.api.cron.schedule, co.wrap(job));
        console.log('Cron enabled', config.apps.api.cron.schedule);
    }
};

import knox from 'knox';
import moment from 'moment';

export const renameFileInS3 = (client, config) => fileUrl => new Promise((resolve, reject) => {
    const headers = {
        'x-amz-metadata-directive': 'REPLACE',
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'public-read',
        'x-amz-meta-Cache-Control': 'max-age=86400',
        'Expires': moment().endOf('day').utc().toISOString(),
    };

    client.copyFile(fileUrl, config.currentFileUrl, headers, (err, response) => {
        if (err) {
            return reject(err);
        }

        if (response.statusCode !== 200) {
            return reject(new Error('Error while uploading video'));
        }

        resolve();
    });
});

export default (config) => fileUrl => {
    const client = knox.createClient({
        bucket: config.bucket,
        key: config.apiKey,
        secret: config.secret,
    });

    return renameFileInS3(client, config)(fileUrl);
};

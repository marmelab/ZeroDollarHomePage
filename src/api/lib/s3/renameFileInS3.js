import knox from 'knox';
import moment from 'moment';

export default (config) => fileUrl => new Promise((resolve, reject) => {
    const client = knox.createClient({
        bucket: config.bucket,
        key: config.apiKey,
        secret: config.secret,
    });

    const headers = {
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'public-read',
        'Expires': moment().endOf('day'),
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

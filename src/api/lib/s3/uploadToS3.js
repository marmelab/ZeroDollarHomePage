import knox from 'knox';

export const uploadToS3 = client => (filename, imageAsBuffer) => new Promise((resolve, reject) => {
    client.putBuffer(imageAsBuffer, `/${filename}`, {
        'Content-Length': imageAsBuffer.size,
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'public-read',
    }, (err, response) => {
        if (err) {
            return reject(err);
        }

        if (response.statusCode !== 200) {
            return reject(new Error('Error while uploading image'));
        }

        resolve(client.http(`/${filename}`));
    });
});

export default (config) => (filename, stream) => {
    const client = knox.createClient({
        key: config.apiKey,
        secret: config.secret,
        bucket: config.bucket,
    });

    return uploadToS3(client)(filename, stream);
};

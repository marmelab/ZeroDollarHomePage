import knox from 'knox';

export const uploadToS3 = client => (filename, stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', err => reject(err));
    stream.on('end', () => {
        const finalBuffer = Buffer.concat(chunks);

        client.putBuffer(finalBuffer, `/${filename}`, {
            'Content-Length': finalBuffer.size,
            'Content-Type': 'image/jpeg',
            'x-amz-acl': 'public-read',
        }, (err, response) => {
            if (err) {
                return reject(err);
            }

            if (response.statusCode !== 200) {
                return reject(new Error('Error while uploading video'));
            }

            resolve(client.http(`/${filename}`));
        });
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

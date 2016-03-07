export const uploadToS3 = stream => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', err => reject(err));
    stream.on('end', () => {
        resolve(Buffer.concat(chunks));
    });
});

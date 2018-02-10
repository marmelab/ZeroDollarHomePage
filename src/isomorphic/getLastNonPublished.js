import initializeProxy from './initializeProxy';

export const getLastNonPublished = smartContractProxy => new Promise((resolve, reject) => {
    smartContractProxy.getLastNonPublished(false)
        .then(pullRequestId => {
            if (pullRequestId === null || typeof pullRequestId === 'undefined') {
                return reject(new Error('Invalid response from getLastNonPublished'));
            }
            resolve(pullRequestId.toNumber());
        });
});

export default (config) => function* getLastNonPublishedDefault() {
    const smartContractProxy = initializeProxy(config);
    return yield getLastNonPublished(smartContractProxy);
};

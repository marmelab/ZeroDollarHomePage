import co from 'co';
import initializeProxy from './initializeProxy';

export const newRequest = (smartContractProxy) => (sendTransaction, pullrequestId) => new Promise(co.wrap(function* newRequestFunc(resolve, reject) {
    const succeeded = yield smartContractProxy.newRequest(sendTransaction, pullrequestId);

    if (!succeeded) {
        return reject();
    }
    resolve();
}));

export default (config) => function* newRequestDefault(sendTransaction, pullrequestId) {
    const smartContractProxy = initializeProxy(config);
    const request = newRequest(smartContractProxy);
    return yield request(sendTransaction, pullrequestId);
};

import initializeProxy from './initializeProxy';
import getReponseCodeMessageFunc from './getReponseCodeMessage';

export const closeRequest = (smartContractProxy, getReponseCodeMessage) => function* closeRequestFunc(sendTransaction) {
    // result will be an array containing the response code at index 0 and the publication timestamp at index 1
    // Trying to destructure array with `const [code, timestamp] = result;` throws an error
    const result = yield smartContractProxy.closeRequest(sendTransaction);

    // 5 = EmptyQueue
    if (result[0] === 5) return false;

    if (result[0] !== 0) throw new Error(getReponseCodeMessage(result[0]));

    return true;
};

export default (config) => function* closeRequestDefault(sendTransaction) {
    const smartContractProxy = initializeProxy(config);
    const request = closeRequest(smartContractProxy, getReponseCodeMessageFunc);
    return yield request(sendTransaction);
};

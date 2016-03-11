import initializeProxy from './initializeProxy';
import getReponseCodeMessageFunc from './getReponseCodeMessage';

export const getRequest = (smartContractProxy, getReponseCodeMessage) => function* getRequestFunc(sendTransaction, pullrequestId) {
    // result will be an array containing the response code at index 0 and the publication timestamp at index 1
    // Trying to destructure array with `const [code, timestamp] = result;` throws an error
    const result = yield smartContractProxy.getRequest(sendTransaction, pullrequestId);
    if (result[0] !== 0) {
        throw new Error(getReponseCodeMessage(result[0]));
    }

    return result[1];
};

export default (config) => function* getRequestDefault(sendTransaction, pullrequestId) {
    const smartContractProxy = initializeProxy(config);
    const request = getRequest(smartContractProxy, getReponseCodeMessageFunc);
    return yield request(sendTransaction, pullrequestId);
};

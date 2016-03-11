import initializeProxy from './initializeProxy';
import getReponseCodeMessageFunc from './getReponseCodeMessage';

export const newRequest = (smartContractProxy, getReponseCodeMessage) => function* newRequestFunc(sendTransaction, pullrequestId, authorName) {
    // result will be an array containing the response code at index 0 and the publication timestamp at index 1
    // Trying to destructure array with `const [code, timestamp] = result;` throws an error
    const result = yield smartContractProxy.newRequest(sendTransaction, pullrequestId, authorName);
    if (!result) return null;

    console.log('RESULT', result);
    if (result[0] !== 0) {
        throw new Error(getReponseCodeMessage(result[0]));
    }

    return result[1];
};

export default (config) => function* newRequestDefault(sendTransaction, pullrequestId, authorName, imageUrl) {
    const smartContractProxy = initializeProxy(config);
    const request = newRequest(smartContractProxy, getReponseCodeMessageFunc);
    return yield request(sendTransaction, pullrequestId, authorName, imageUrl);
};

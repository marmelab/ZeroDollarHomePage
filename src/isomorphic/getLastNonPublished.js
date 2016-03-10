import initializeProxy from './initializeProxy';
import getReponseCodeMessageFunc from './getReponseCodeMessage';

export const getLastNonPublished = function* getLastNonPublished(smartContractProxy, getReponseCodeMessage) {
    // getLastNonPublished() returns (uint8 code, uint id, string authorName, string imageUrl, uint createdAt)
    // result will be an array containing the response code at index 0 and rest after
    // Trying to destructure array with `const [code, ...] = result;` throws an error
    const result = yield smartContractProxy.getLastNonPublished();
    // 5 = EmptyQueue
    if (result[0] === 5) {
        return false;
    }

    if (result[0] !== 0) {
        throw new Error(getReponseCodeMessage(result[0]));
    }

    return {
        pullrequestId: result[1],
        authorName: result[2],
        createdAt: result[3],
    };
};

export default (config) => function* newRequest() {
    const smartContractProxy = initializeProxy(config);
    return getLastNonPublished(smartContractProxy, getReponseCodeMessageFunc);
};

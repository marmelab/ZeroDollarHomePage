import co from 'co';
import moment from 'moment';
import initializeProxy from './initializeProxy';
import getReponseCodeMessageFunc from './getReponseCodeMessage';

export const getRequest = smartContractProxy => (sendTransaction, pullrequestId) => new Promise(co.wrap(function* getRequestFunc(resolve, reject) {
    // result will be an array containing the response code at index 0 and the publication timestamp at index 1
    // Trying to destructure array with `const [code, timestamp] = result;` throws an error
    const position = yield smartContractProxy.getRequestPosition(sendTransaction, pullrequestId);
    const timeBeforeDisplay = moment().add(position[0] + 1, 'days').toDate();

    resolve(timeBeforeDisplay);
}));

export default (config) => function* getRequestDefault(sendTransaction, pullrequestId) {
    const smartContractProxy = initializeProxy(config);
    const request = getRequest(smartContractProxy, getReponseCodeMessageFunc);
    return yield request(sendTransaction, pullrequestId);
};

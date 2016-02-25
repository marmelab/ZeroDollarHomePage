import config from 'config';
import smartContractProxyFactory from '../../isomorphic/smartContractProxy';
import loadErisAccount from '../../isomorphic/loadErisAccount';

const errorMessagesForCodes = {
    1: 'Invalid pull request identifier', // InvalidPullRequestId,
    2: 'Invalid pull request author name', // InvalidAuthorName,
    3: 'Invalid image url', // InvalidImageUrl,
    4: 'Request not found', // RequestNotFound,
    5: 'Empty queue', // EmptyQueue
};

export default function* registerContract(pullrequestId, authorName, imageUrl) {
    const account = loadErisAccount(config.eris.account_path);
    const smartContractProxy = smartContractProxyFactory('ZeroDollarHomePage', {
        url: config.eris.url,
        account,
    });

    // result will be an array containing the response code at index 0 and the publication timestamp at index 1
    // Trying to destructure array with `const [code, timestamp] = result;` throws an error
    const result = yield smartContractProxy.newRequest(pullrequestId, authorName, imageUrl);
    if (result[0] !== 0) {
        throw new Error(errorMessagesForCodes[result[0]]);
    }

    return result[1];
}

import co from 'co';
import initializeProxy from './initializeProxy';

export const newRequest = (smartContractProxy, pullrequestId) =>
    new Promise(co.wrap(function* newRequestFunc(resolve, reject) {
        try {
            const logs = yield smartContractProxy.newRequest(true, pullrequestId);

            if (logs.length === 0) {
                return reject(new Error('Transaction failed (Invalid logs)'));
            }

            const log = logs[0];

            if (log.event === 'PullRequestClaimed') {
                return resolve(log.args.timeBeforeDisplay.toNumber());
            }

            if (log.event === 'PullRequestAlreadyClaimed') {
                const number = log.args.timeBeforeDisplay;

                if (log.args.past) {
                    return resolve(number.negated().toNumber());
                }
                return resolve(number.toNumber());
            }

            if (log.event === 'InvalidPullRequest') {
                return reject(new Error('Invalid pull request id'));
            }
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
            reject(err);
        }
    }));

export default (config) =>
    function* newRequestDefault(pullrequestId) {
        const smartContractProxy = initializeProxy(config);
        return yield newRequest(smartContractProxy, pullrequestId);
    };

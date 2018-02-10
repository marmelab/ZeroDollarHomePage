import initializeProxy from './initializeProxy';

export const closeRequest = smartContractProxy =>
    smartContractProxy.closeRequest(true);

export default (config) => function* closeRequestDefault() {
    const smartContractProxy = initializeProxy(config);
    return yield closeRequest(smartContractProxy);
};

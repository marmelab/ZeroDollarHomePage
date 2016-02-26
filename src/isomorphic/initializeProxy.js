import smartContractProxyFactory from './smartContractProxy';
import loadErisAccount from './loadErisAccount';

export default (config) => {
    const account = loadErisAccount(config.account_path);
    return smartContractProxyFactory('ZeroDollarHomePage', {
        url: config.url,
        account,
    });
};

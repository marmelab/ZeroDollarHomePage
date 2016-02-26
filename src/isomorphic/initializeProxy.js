import erisSmartContractFactory from './erisSmartContract';
import loadErisAccount from './loadErisAccount';
import ethereumSmartContractFactory from './ethereumSmartContract';

export default (config, name) => {
    switch (config.provider) {
    case 'ethereum':
        return ethereumSmartContractFactory(name);
    case 'eris':
    default:
        const account = loadErisAccount(config.eris.account_path);
        return erisSmartContractFactory(name, {
            url: config.url,
            account,
        });
    }
};

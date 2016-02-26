import erisSmartContractFactory from './erisSmartContract';
import loadErisAccount from './loadErisAccount';
import ethereumSmartContractFactory from './ethereumSmartContract';

export default (config, name) => {
    switch (config.provider) {
    case 'ethereum':
        return ethereumSmartContractFactory(name);
    case 'eris':
        return erisSmartContractFactory(name, {
            url: config.url,
            account: loadErisAccount(config.eris.account_path),
        });
    default:
        throw new Error(`Unable to found "${config.provider}" blockchain provider.`);
    }
};

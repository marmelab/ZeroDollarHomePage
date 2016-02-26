import fs from 'fs';
import eris from 'eris-contracts';

import cleanContractValue from './cleanSmartContractValue';

export function proxifyFunction(replacedFunction) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            args.push((err, value) => {
                if (err) return reject(err);
                if (Array.isArray(value)) return resolve(value.filter(v => !!v).map(cleanContractValue));
                return resolve(cleanContractValue(value));
            });
            replacedFunction(...args);
        });
    };
}

export function getContractFromName(name, {url, account}, ethDirectory = './src/ethereum') {
    try {
        fs.accessSync(`${ethDirectory}/epm.json`, fs.F_OK);
    } catch (err) {
        throw new Error(`Unable to fetch eris package manager result (epm.json).
                         Have you compile your contracts ?`);
    }

    const contractData = JSON.parse(fs.readFileSync(`${ethDirectory}/epm.json`));
    const address = contractData[`deploy${name}`];
    const abi = JSON.parse(fs.readFileSync(`${ethDirectory}/abi/${address}`));
    const manager = eris.newContractManagerDev(url, account);
    return manager.newContractFactory(abi).at(address);
}

/**
 * Usage:
 *      const mySmartContract = smartContractProxy('MySmartContract', {
 *          url: 'http://localhost:1337/rpc',
 *          account: {...yourAccount},
 *      });
 *      yield mySmartContract.setAttribute('new value');
 *      const result = yield mySmartContract.getAttribute();
 */
export default function smartContractFactory(name, account, excludedFields = [], getContract = getContractFromName) {
    const contract = getContract(name, account);

    // Exclude default functions
    ['getContributorToDisplay'].forEach(field => excludedFields.push(field));

    contract.abi
        .filter(field => field.name && excludedFields.indexOf(field.name) === -1)
        .forEach(field => {
            if (field.type === 'function') {
                contract[field.name] = proxifyFunction(contract[field.name]);
            }
        });

    return contract;
}

import fs from 'fs';
import eris from 'eris-contracts';
import contractData from '../ethereum/epm.json';

export const cleanContractValue = entry => {
    if (entry.c) return entry.c[0];
    return entry;
};

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

export function getContractFromName(name, {url, account}) {
    const address = contractData[`deploy${name}`];
    const abi = JSON.parse(fs.readFileSync(`./src/ethereum/abi/${address}`));
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

import fs from 'fs';
import path from 'path';
import config from 'config';
import Web3 from 'web3';

import cleanContractValue from './cleanSmartContractValue';

export const buildClient = (url = config.ethereum.url) => {
    const web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(url));

    return web3;
};

export const compileContract = (client, name) => {
    const rawContract = fs.readFileSync(path.resolve(__dirname, `../ethereum/${name}.sol`), 'utf8');
    const compiledContract = client.eth.compile.solidity(rawContract)[name];
    return client.eth.contract(compiledContract.info.abiDefinition);
};

export default function ethereumSmartContract(name, client = buildClient()) {
    const contract = compileContract(client, name);
    const instance = contract.at(client.eth.coinbase);

    instance.abi
        .filter(field => field.name)
        .forEach(field => {
            if (field.type === 'function') {
                const replacedAttribute = instance[field.name];
                instance[field.name] = (...args) => {
                    const result = replacedAttribute.call(...args);
                    return cleanContractValue(result);
                };
            }
        });

    return instance;
}

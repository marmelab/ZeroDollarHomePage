import fs from 'fs';
import path from 'path';
import config from 'config';
import Web3 from 'web3';

import cleanContractValue from './cleanSmartContractValue';

export const buildClient = (url = config.blockchain.ethereum.url) => {
    const web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(url));

    return web3;
};

export const compileContract = (client, name) => {
    const rawContract = fs.readFileSync(path.resolve(__dirname, `../../ethereum/${name}.sol`), 'utf8');
    return client.eth.compile.solidity(rawContract)[name];
};

export const getContractAddress = () => {
    const addressPath = path.resolve(__dirname, '../../../.eris/contractAddress.txt');
    try {
        return fs.readFileSync(addressPath, 'utf8');
    } catch (err) {
        throw new Error(`Unable to fetch contract address (${addressPath}).
                         Have you deployed your contracts ?`);
    }
};

export const getReceipt = (client, transactionHash) => new Promise((resolve, reject) => {
    let checkId = null;

    // Throw timeout after 60s
    const cancelId = setTimeout(() => {
        if (checkId !== null) clearTimeout(checkId);
        console.log('TIMEOUT');
        return reject(new Error('Timeout'));
    }, 60 * 1000);

    function checkTransaction() {
        const receipt = client.eth.getTransactionReceipt(transactionHash);

        if (receipt !== null) {
            clearTimeout(cancelId);
            console.log('receipt', receipt);
            return resolve(receipt);
        }

        checkId = setTimeout(checkTransaction, 1000);
    }

    checkTransaction();
});

export default function ethereumSmartContract(name, client = buildClient(), compile = compileContract) {
    const compiledContract = compile(client, name);
    const contract = client.eth.contract(compiledContract.info.abiDefinition);
    const address = getContractAddress();
    const instance = contract.at(address);

    instance.abi
        .filter(field => field.name)
        .forEach(field => {
            if (field.type === 'function') {
                const replacedAttribute = instance[field.name];
                instance[field.name] = (...args) => new Promise((resolve, reject) => {
                    const shouldSendTransaction = args.shift();
                    console.log('shouldSendTransaction', shouldSendTransaction);
                    console.log('coinbase', client.eth.coinbase);

                    if (shouldSendTransaction) {
                        replacedAttribute.sendTransaction(
                            ...args,
                            {
                                from: client.eth.coinbase,
                            },
                            (err, hash) => {
                                console.log('hash', hash);
                                if (err) return reject(err);

                                return getReceipt(client, hash).then(() => resolve());
                            }
                        );
                    } else {
                        console.log(`call ${field.name}`);
                        replacedAttribute.call(...args, (err, value) => {
                            if (err) return reject(err);
                            if (Array.isArray(value)) return resolve(value.filter(v => !!v).map(cleanContractValue));
                            return resolve(cleanContractValue(value));
                        });
                    }
                });
            }
        });

    return instance;
}

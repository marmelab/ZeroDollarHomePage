import fs from 'fs';
import path from 'path';
import config from 'config';
import Web3 from 'web3';

import cleanContractValue from './cleanSmartContractValue';

export const buildClient = (url = config.blockchain.ethereum.url) => {
    const web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(url));
    web3.eth.defaultAccount = web3.eth.coinbase;

    return web3;
};

export const compileContract = (client, name) => {
    const rawContract = fs.readFileSync(path.resolve(__dirname, `../../ethereum/${name}.sol`), 'utf8');
    return client.eth.compile.solidity(rawContract)[name];
};

export const getContractAddressFromFile = () => {
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
        return reject(new Error('Timeout'));
    }, 60 * 1000);

    function checkTransaction() {
        const receipt = client.eth.getTransactionReceipt(transactionHash);

        if (receipt !== null) {
            clearTimeout(cancelId);
            return resolve(receipt);
        }

        checkId = setTimeout(checkTransaction, 10000);
    }

    checkTransaction();
});

/*
* Watch for a particular transaction hash and call the awaiting function when done;
* Ether-pudding uses another method, with web3.eth.getTransaction(...) and checking the txHash;
* on https://github.com/ConsenSys/ether-pudding/blob/master/index.js
*/
export const waitTx = (client, txHash, callback) => {
    let blockCounter = 15;
    // Wait for tx to be finished
    let filter = client.eth.filter('latest').watch((err, blockHash) => {
        if (blockCounter <= 0) {
            filter.stopWatching();
            filter = null;
            if (callback) return callback(err, false);
            return false;
        }
        // Get info about latest Ethereum block
        const block = client.eth.getBlock(blockHash);
        --blockCounter;
        // Found tx hash?
        if (block.transactions.indexOf(txHash) > -1) {
            // Tx is finished
            filter.stopWatching();
            filter = null;
            if (callback) return callback(err, true);
            return true;
        }
    });
};

export default function ethereumSmartContract(name, client = buildClient(), compile = compileContract, getContractAddress = getContractAddressFromFile) {
    const compiledContract = compile(client, name);
    const contract = client.eth.contract(compiledContract.info.abiDefinition);
    const address = getContractAddress();
    const instance = contract.at(address);

    instance.abi
        .filter(field => {
            if (field.type === 'function') {
                const replacedAttribute = instance[field.name];

                if (!field.constant) {
                    replacedAttribute.waitTransaction = (...args) => {
                        const customArgs = args.slice().filter(a => a !== undefined);
                        let oldCall;

                        if (typeof(args[args.length - 1]) === 'function') {
                            oldCall = customArgs.pop(); // Modify the args array!
                        }

                        const newCall = (_, tx) => {
                            waitTx(client, tx, oldCall);
                        };

                        customArgs.push(newCall);
                        replacedAttribute.sendTransaction.apply(instance, customArgs);
                    };
                }

                instance[field.name] = (...args) => new Promise((resolve, reject) => {
                    const shouldSendTransaction = args.shift();
                    if (shouldSendTransaction) {
                        replacedAttribute.waitTransaction(...args, {
                            to: client.eth.coinbase,
                        }, (err, succeeded) => {
                            if (err) {
                                console.error({ err });
                                return reject(err);
                            }

                            return resolve(succeeded);
                        });
                    } else {
                        replacedAttribute.call(...args, (err, value) => {
                            if (err) {
                                console.error({ err });
                                return reject(err);
                            }
                            if (Array.isArray(value)) return resolve(value.filter(v => !!v).map(cleanContractValue));
                            return resolve(value.c);
                        });
                    }
                });
            }
        });

    return instance;
}

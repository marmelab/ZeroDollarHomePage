import fs from 'fs';
import path from 'path';
import config from 'config';
import Web3 from 'web3';
import SolidityEvent from 'web3/lib/web3/event';

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
    const addressPath = path.resolve(__dirname, '../../../.ethereum/contractAddress.txt');
    try {
        return fs.readFileSync(addressPath, 'utf8');
    } catch (err) {
        throw new Error(`Unable to fetch contract address (${addressPath}).
                         Have you deployed your contracts ?`);
    }
};

/**
* Watch for a particular transaction hash and call the awaiting function when done;
* Ether-pudding uses another method, with web3.eth.getTransaction(...) and checking the txHash;
* on https://github.com/ConsenSys/ether-pudding/blob/master/index.js
*/
const waitTx = (client, txHash) => new Promise((resolve, reject) => {
    let blockCounter = 15;
    // Wait for tx to be finished
    let filter = client.eth.filter('latest').watch((err, blockHash) => {
        if (blockCounter <= 0) {
            filter.stopWatching();
            filter = null;
            return reject(err || new Error('Transaction failed (not mined)'));
        }
        // Get info about latest Ethereum block
        const block = client.eth.getBlock(blockHash);
        --blockCounter;
        // Found tx hash?
        if (block.transactions.indexOf(txHash) > -1) {
            // Tx is finished
            filter.stopWatching();
            filter = null;
            return resolve(txHash);
        }
    });
});

/**
 * Request the receipt for the transaction specified by its hash
 */
const getReceipt = (client, transactionHash) => new Promise((resolve, reject) => {
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

/**
 * Parse the logs from a transaction receipt to eventually get a list of events
 * triggered by the transaction.
 * Taken from: https://github.com/barkthins/ether-pudding/blob/master/index.js#L23
 */
const parseReceiptLogs = (logs, abi) => {
    const decoders = abi
        .filter(json => json.type === 'event')
        // note first and third params only required only by encode and execute; so don't call those!
        .map(json => new SolidityEvent(null, json, null));

    return Array.from(logs).map(log =>
        decoders.find(decoder => {
            const decoderSignature = decoder.signature();
            const logSignature = log.topics[0].replace('0x', '');

            return decoderSignature === logSignature;
        }).decode(log)
    );
};

export default function ethereumSmartContract(name, client = buildClient(), compile = compileContract, getContractAddress = getContractAddressFromFile) {
    const compiledContract = compile(client, name);
    const contract = client.eth.contract(compiledContract.info.abiDefinition);
    const address = getContractAddress();
    const contractInstance = contract.at(address);

    contractInstance.abi
        .filter(field => {
            if (field.type === 'function') {
                const replacedFunction = contractInstance[field.name];

                contractInstance[field.name] = (...args) => new Promise((resolve, reject) => {
                    const shouldSendTransaction = args.shift();

                    if (shouldSendTransaction) {
                        replacedFunction.sendTransaction(...args, {
                            to: client.eth.coinbase,
                        }, (err, tx) => {
                            if (err) {
                                console.error({ err }); // eslint-disable-line no-console
                                return reject(err);
                            }

                            waitTx(client, tx)
                                .then(txHash => {
                                    if (!txHash) return reject(new Error('Transaction failed (no transaction hash)'));

                                    getReceipt(client, txHash)
                                        .then(receipt => {
                                            resolve(parseReceiptLogs(receipt.logs, compiledContract.info.abiDefinition));
                                        })
                                        .catch(errForGetReceipt => reject(errForGetReceipt));
                                })
                                .catch(errForWaitTx => reject(errForWaitTx));
                        });
                    } else {
                        replacedFunction.call(...args, (err, value) => {
                            if (err) {
                                console.error({ err }); // eslint-disable-line no-console
                                return reject(err);
                            }
                            if (Array.isArray(value)) return resolve(value.filter(v => !!v));
                            return resolve(value);
                        });
                    }
                });
            }
        });

    return contractInstance;
}

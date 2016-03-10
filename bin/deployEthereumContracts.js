/* eslint-disable no-console */
import fs from 'fs';
import { buildClient, compileContract } from '../src/isomorphic/smartContract/ethereumSmartContract';

const client = buildClient();
const compiledContract = compileContract(client, 'ZeroDollarHomePage');

const estimatedGas = client.eth.estimateGas({
    from: client.eth.coinbase,
    data: compiledContract.code,
});

const transactionHash = client.eth.sendTransaction({
    from: client.eth.coinbase,
    data: compiledContract.code,
    gas: estimatedGas,
});

// Wait until the blockchain have accepted our transaction
new Promise((resolve, reject) => {
    console.log('Contract sended, waiting for confirmation ...');
    let checkId = null;

    // Throw timeout after 30s
    const cancelId = setTimeout(() => {
        if (checkId !== null) clearTimeout(checkId);
        reject(new Error('Timeout'));
    }, 30 * 1000);

    function checkTransaction() {
        const receipt = client.eth.getTransactionReceipt(transactionHash);

        if (receipt !== null) {
            clearTimeout(cancelId);
            return resolve(receipt);
        }

        checkId = setTimeout(checkTransaction, 1000);
    }

    checkTransaction();
})
.then(receipt => {
    fs.writeFileSync(`${__dirname}/../.eris/contractAddress.txt`, receipt.contractAddress, 'utf8');
    console.log('Contract deployed at', receipt.contractAddress);
})
.catch(err => console.log('An error occured:', err.message));

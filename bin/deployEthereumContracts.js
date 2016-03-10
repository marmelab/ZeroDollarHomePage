/* eslint-disable no-console */
import fs from 'fs';
import { buildClient, compileContract, getReceipt } from '../src/isomorphic/smartContract/ethereumSmartContract';

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
getReceipt(client, transactionHash)
    .then(receipt => {
        fs.writeFileSync(`${__dirname}/../.eris/contractAddress.txt`, receipt.contractAddress, 'utf8');
        console.log('Contract deployed at', receipt.contractAddress);
    })
    .catch(err => console.log('An error occured:', err.message));

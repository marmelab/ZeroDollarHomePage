/* eslint-disable no-console */
import config from 'config';
import fs from 'fs';
import { buildClient, compileContract } from '../src/isomorphic/smartContract/ethereumSmartContract';

const client = buildClient();
const compiledContract = compileContract(client, 'ZeroDollarHomePage');
console.log(JSON.stringify(compiledContract.info.abiDefinition, null, 2));
const contract = client.eth.contract(compiledContract.info.abiDefinition);

// deploy new contract
contract.new({
    data: compiledContract.code,
    from: config.blockchain.ethereum.senderAddress,
    gas: 1000000,
}, (err, deployedContract) => {
    if (err) return console.error(err);

    if (!deployedContract.address) {
        console.log({transactionHash: deployedContract.transactionHash});
    } else {
        fs.writeFileSync(`${__dirname}/../.eris/contractAddress.txt`, deployedContract.address, 'utf8');
        console.log('Contract deployed at', deployedContract.address);
    }
});

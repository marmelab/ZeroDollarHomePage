/* eslint-disable no-console */
import fs from 'fs';
import { buildClient, compileContract } from '../src/isomorphic/smartContract/ethereumSmartContract';

const client = buildClient();
const compiledContract = compileContract(client, 'ZeroDollarHomePage');
const contract = client.eth.contract(compiledContract.info.abiDefinition);

contract.new({
    data: compiledContract.code,
    from: client.eth.coinbase,
    gas: 1000000,
}, (err, deployedContract) => {
    if (deployedContract.address) {
        fs.writeFileSync(`${__dirname}/../.ethereum/contractAddress.txt`, deployedContract.address, 'utf8');
        console.log('Contract deployed at', deployedContract.address);
    }
});

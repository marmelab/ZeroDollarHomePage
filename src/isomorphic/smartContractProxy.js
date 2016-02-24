import fs from 'fs';
import eris from 'eris-contracts';
import contractData from '../ethereum/epm.json';

export default function smartContractFactory(name, {url, account}) {
    const address = contractData[`deploy${name}`];
    const abi = JSON.parse(fs.readFileSync(`./src/ethereum/abi/${address}`));
    const manager = eris.newContractManagerDev(url, account);
    const contract = manager.newContractFactory(abi).at(address);

    return contract;
}

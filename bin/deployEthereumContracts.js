import { buildClient, compileContract } from '../src/isomorphic/smartContract/ethereumSmartContract';

export default () => {
    const client = buildClient();
    const compiledContract = compileContract(client, 'ZeroDollarHomePage');
    const contract = client.eth.contract(compiledContract.info.abiDefinition);
    const contractInstance = contract.new({
        data: compiledContract.code,
        from: client.eth.coinbase,
        gas: 1000000,
    });

    if (contractInstance) {
        console.log('Deployed contract:', {
            transactionHash: contractInstance.transactionHash,
            address: contractInstance.address,
        });
    }
};

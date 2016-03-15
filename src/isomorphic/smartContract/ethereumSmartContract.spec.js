import { assert } from 'chai';
import sinon from 'sinon';
import smartContract from './ethereumSmartContract';

describe('Ethereum Smart Contract', () => {
    const funcToTest = sinon.spy(() => 42);
    const expectedAbi = [{name: 'funcToTest', type: 'function'}];
    const expectedContract = {
        abi: expectedAbi,
        funcToTest,
        setAttribute: sinon.spy(),
        getAttribute: sinon.spy(),
        publicAttribute: 42,
    };
    const contract = { at: sinon.stub().returns(expectedContract) };
    const getContractAddressFrom = sinon.stub().returns('address');
    const compiledContract = { info: { abiDefinition: '' } };
    const client = {
        eth: {
            coinbase: 'coinbase',
            contract: sinon.stub().returns(contract),
        },
    };

    const compileContract = sinon.stub().returns(compiledContract);
    const contractInstance = smartContract('name', client, compileContract, getContractAddressFrom);

    it('should create contract from name', () => {
        smartContract('name', client, compileContract, getContractAddressFrom);
        assert.deepEqual(compileContract.getCall(0).args, [client, 'name']);
    });

    it('should return the same object than returned by contract', () => {
        assert.deepEqual(contractInstance, expectedContract);
    });

    it('should overwrite all fonctions into a yieldable', function* () { // eslint-disable-line func-names
        const funcResult = yield contractInstance.funcToTest();

        assert.deepEqual(Object.keys(contractInstance), ['abi', 'funcToTest']);
        assert.deepEqual(contractInstance.abi, expectedAbi);
        assert.deepEqual(funcResult, 42);
    });
});

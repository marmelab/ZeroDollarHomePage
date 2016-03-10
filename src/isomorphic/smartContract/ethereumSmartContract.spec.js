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
    const compiledContract = { info: { abiDefinition: '' } };
    const client = {
        eth: {
            coinbase: 'coinbase',
            contract: sinon.stub().returns(contract),
        },
    };

    const compileContract = sinon.stub().returns(compiledContract);

    it('should create contract from name', () => {
        smartContract('name', client, compileContract);

        assert.deepEqual(compileContract.getCall(0).args, [client, 'name']);
    });

    it('should return the same object than returned by contract', () => {
        const res = smartContract('name', client, compileContract);

        assert.deepEqual(res, expectedContract);
    });

    it('should overwrite all fonctions into a yieldable', function* () {
        const res = smartContract('name', client, compileContract);
        const funcResult = yield res.funcToTest();

        assert.deepEqual(Object.keys(res), ['abi', 'funcToTest']);
        assert.deepEqual(res.abi, expectedAbi);
        assert.deepEqual(funcResult, 42);
    });
});

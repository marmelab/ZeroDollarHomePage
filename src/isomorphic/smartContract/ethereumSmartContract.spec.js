import { assert } from 'chai';
import sinon from 'sinon';
import smartContract from './ethereumSmartContract';

describe('Ethereum Smart Contract', () => {
    let client;
    let expectedContract;
    let compiledContract;
    let compileContract;

    beforeEach(() => {
        client = {eth: {coinbase: 'coinbase'}};
        expectedContract = {abi: []};
        compiledContract = {at: sinon.spy(() => expectedContract)};
        compileContract = sinon.spy(() => compiledContract);
    });

    it('should create contract from name', () => {
        smartContract('name', client, compileContract);

        assert.deepEqual(compileContract.getCall(0).args, [client, 'name']);
    });

    it('should return the same object than returned by contract', () => {
        expectedContract = {
            abi: [],
            setAttribute: sinon.spy(),
            getAttribute: sinon.spy(),
            publicAttribute: 42,
        };

        const res = smartContract('name', client, compileContract);

        assert.deepEqual(res, expectedContract);
    });

    it('should overwrite all fonctions into a yieldable', function* () {
        const funcToTest = sinon.spy(() => 42);
        const expectedAbi = [{name: 'funcToTest', type: 'function'}];
        expectedContract = {
            abi: expectedAbi,
            funcToTest,
        };

        const res = smartContract('name', client, compileContract);
        const funcResult = yield res.funcToTest();

        assert.deepEqual(Object.keys(res), ['abi', 'funcToTest']);
        assert.deepEqual(res.abi, expectedAbi);
        assert.deepEqual(funcResult, 42);
    });
});

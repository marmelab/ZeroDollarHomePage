import { assert } from 'chai';
import sinon from 'sinon';
import smartContract from './erisSmartContract';

describe('Eris Smart Contract', () => {
    const funcToTest = sinon.spy(() => 42);
    const expectedAbi = [
        {name: 'getContributorToDisplay', type: 'function'}, // This should be excluded
        {name: 'funcToTest', type: 'function'},
    ];

    const expectedContract = {
        abi: expectedAbi,
        funcToTest,
        setAttribute: sinon.spy(),
        getAttribute: sinon.spy(),
        publicAttribute: 42,
    };

    const getContract = sinon.stub().returns(expectedContract);

    it('should create contract from name', () => {
        smartContract('name', {url: 'localhost', account: 'valid account'}, [], getContract);

        assert.deepEqual(getContract.getCall(0).args, [
            'name',
            {url: 'localhost', account: 'valid account'},
        ]);
    });

    it('should return the same object than returned by contract', () => {
        const res = smartContract('name', {url: 'localhost', account: 'valid account'}, [], getContract);

        assert.deepEqual(res, expectedContract);
    });

    it('should overwrite all fonctions into a yieldable', function* () {
        const res = smartContract('name', {url: 'localhost', account: 'valid account'}, [], getContract);
        const funcResult = yield res.funcToTest();

        assert.deepEqual(Object.keys(res), ['abi', 'funcToTest']);
        assert.deepEqual(res.abi, expectedAbi);
        assert.deepEqual(funcResult, 42);
    });
});

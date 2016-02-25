import { assert } from 'chai';
import sinon from 'sinon';
import smartContract from './smartContractProxy';

describe('Smart Contract Proxy', () => {
    let getContract;

    beforeEach(() => {
        getContract = sinon.spy(() => ({abi: []}));
    });

    it('should create contract from name', () => {
        smartContract('name', {url: 'localhost', account: 'valid account'}, [], getContract);

        assert.deepEqual(getContract.getCall(0).args, [
            'name',
            {url: 'localhost', account: 'valid account'},
        ]);
    });

    it('should return the same object than returned by contract', () => {
        const expectedValues = {
            abi: [],
            setAttribute: sinon.spy(),
            getAttribute: sinon.spy(),
            publicAttribute: 42,
        };
        getContract = sinon.spy(() => expectedValues);

        const res = smartContract('name', {url: 'localhost', account: 'valid account'}, [], getContract);

        assert.deepEqual(res, expectedValues);
    });

    it('should overwrite all fonctions into a yieldable', function* () {
        const funcToTest = sinon.spy(() => 42);
        const expectedAbi = [
            {name: 'getContributorToDisplay', type: 'function'}, // This should be excluded
            {name: 'funcToTest', type: 'function'},
        ];
        getContract = sinon.spy(() => ({
            abi: expectedAbi,
            funcToTest,
        }));

        const res = smartContract('name', {url: 'localhost', account: 'valid account'}, [], getContract);
        const funcResult = yield res.funcToTest();

        assert.deepEqual(Object.keys(res), ['abi', 'funcToTest']);
        assert.deepEqual(res.abi, expectedAbi);
        assert.deepEqual(funcResult, 42);
    });
});

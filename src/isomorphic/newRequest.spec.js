import co from 'co';
import { expect } from 'chai';
import { newRequest } from './newRequest';

describe('newRequest', () => {
    it('should return the second result from smartContractProxy call', function*() {
        const smartContractProxy = {
            newRequest: function* () {
                return [ 0, 42 ];
            },
        };
        const result = yield newRequest(smartContractProxy)();

        expect(result).to.equal(42);
    });

    it('should throw an error when smartContractProxy code is not 0 (Ok)', function*() {
        const smartContractProxy = {
            newRequest: function* () {
                return [ 1 ];
            },
        };

        expect(co.wrap(function* () {
            yield newRequest(smartContractProxy, () => 'Run you fools !')();
        })).to.throw('Run you fools !');
    });
});

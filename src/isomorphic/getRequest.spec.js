import co from 'co';
import { expect } from 'chai';
import { getRequest } from './getRequest';

describe('getRequest', () => {
    it('should return the second result from smartContractProxy call', function*() {
        const smartContractProxy = {
            getRequest: function* () {
                return [ 0, 42 ];
            },
        };
        const result = yield getRequest(smartContractProxy)();

        expect(result).to.equal(42);
    });

    it('should throw an error when smartContractProxy code is not 0 (Ok)', function*() {
        const smartContractProxy = {
            getRequest: function* () {
                return [ 1 ];
            },
        };

        expect(co.wrap(function* () {
            yield getRequest(smartContractProxy, () => 'Run you fools !')();
        })).to.throw('Run you fools !');
    });
});

import co from 'co';
import { expect } from 'chai';
import { newRequest } from './newRequest';

describe('newRequest', () => {
    it('should return an object describing the last non published object from smartContractProxy response', function*() {
        const smartContractProxy = {
            newRequest: function* () {
                return [
                    0,
                ];
            },
        };
        const result = yield newRequest(smartContractProxy)();

        expect(result).to.be.true;
    });

    it('should throw an error when smartContractProxy code is not 0 (Ok)', function*() {
        const smartContractProxy = {
            newRequest: function* () {
                return [
                    1,
                ];
            },
        };

        expect(co.wrap(function* () {
            yield newRequest(smartContractProxy, () => 'Run you fools !')();
        })).to.throw('Run you fools !');
    });
});

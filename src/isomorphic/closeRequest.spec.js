import co from 'co';
import { expect } from 'chai';
import { closeRequest } from './closeRequest';

describe('closeRequest', () => {
    it('should return true if the smartContractProxy response is 0', function*() {
        const smartContractProxy = {
            closeRequest: function* () {
                return [
                    0,
                ];
            },
        };
        const result = yield closeRequest(smartContractProxy);

        expect(result).to.equal(true);
    });

    it('should return false if the smartContractProxy response is 5', function*() {
        const smartContractProxy = {
            closeRequest: function* () {
                return [
                    5,
                ];
            },
        };
        const result = yield closeRequest(smartContractProxy);
        expect(result).to.equal(false);
    });

    it('should throw an error when smartContractProxy code is neither 0 (Ok) or 5 (EmptyQueue)', function*() {
        const smartContractProxy = {
            closeRequest: function* () {
                return [
                    1,
                ];
            },
        };

        expect(co.wrap(function* () {
            yield closeRequest(smartContractProxy, () => 'Run you fools !');
        })).to.throw('Run you fools !');
    });
});

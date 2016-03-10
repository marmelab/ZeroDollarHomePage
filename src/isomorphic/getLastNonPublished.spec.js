import co from 'co';
import { expect } from 'chai';
import { getLastNonPublished } from './getLastNonPublished';

describe('getLastNonPublished', () => {
    it('should return an object describing the last non published object from smartContractProxy response', function*() {
        const smartContractProxy = {
            getLastNonPublished: function* () {
                return [
                    0,
                    'pullrequestId',
                    'authorName',
                    'createdAt',
                ];
            },
        };
        const result = yield getLastNonPublished(smartContractProxy);

        expect(result).to.deep.equal({
            pullrequestId: 'pullrequestId',
            authorName: 'authorName',
            createdAt: 'createdAt',
        });
    });

    it('should return false when smartContractProxy code is 5 (EmptyQueue)', function*() {
        const smartContractProxy = {
            getLastNonPublished: function* () {
                return [
                    5,
                ];
            },
        };
        const result = yield getLastNonPublished(smartContractProxy);

        expect(result).to.equal(false);
    });

    it('should throw an error when smartContractProxy code is neither 0 (Ok) or 5 (EmptyQueue)', function*() {
        const smartContractProxy = {
            getLastNonPublished: function* () {
                return [
                    1,
                ];
            },
        };

        expect(co.wrap(function* () {
            yield getLastNonPublished(smartContractProxy, () => 'Run you fools !');
        })).to.throw('Run you fools !');
    });
});

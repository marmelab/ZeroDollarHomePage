import { expect } from 'chai';
import { getLastNonPublished as getLastNonPublishedFactory } from './getLastNonPublished';

describe('getLastNonPublished', () => {
    it('should call the smartContractProxy.newRequest function with correct parameters', done => {
        const smartContractProxy = {
            getLastNonPublished: sendTransaction => new Promise(resolve => {
                expect(sendTransaction).to.equal(false);
                resolve({
                    toNumber: () => 42,
                });
            }),
        };

        getLastNonPublishedFactory(smartContractProxy).then(() => done()).catch(done);
    });

    it('should resolve with the pullRequestId when getLastNonPublished return an array with the pullRequestId as its first element', done => {
        const smartContractProxy = {
            getLastNonPublished: () => Promise.resolve({
                toNumber: () => 42,
            }),
        };

        getLastNonPublishedFactory(smartContractProxy)
            .then(pullRequestId => {
                expect(pullRequestId).to.equal(42);
                done();
            })
            .catch(done);
    });

    it('should reject with the "Invalid result from getLastNonPublished" message when getLastNonPublished does not return an array of results', done => {
        const smartContractProxy = {
            getLastNonPublished: () => Promise.resolve(),
        };

        getLastNonPublishedFactory(smartContractProxy)
            .then(() => {
                done('Should have been rejected');
            })
            .catch(err => {
                try {
                    expect(err.message).to.equal('Invalid response from getLastNonPublished');
                } catch (error) {
                    return done(error);
                }
                done();
            });
    });
});

/* eslint-disable func-names */
import { expect } from 'chai';
import { newRequest as newRequestFactory } from './newRequest';

describe('newRequest', () => {
    it('should call the smartContractProxy.newRequest function with correct parameters', done => {
        const smartContractProxy = {
            newRequest: (sendTransaction, pullRequestId) => new Promise(resolve => {
                expect(sendTransaction).to.equal(true);
                expect(pullRequestId).to.equal('foo');
                resolve([{
                    event: 'PullRequestClaimed',
                    args: {
                        timeBeforeDisplay: {
                            toNumber: () => 42,
                        },
                    },
                }]);
            }),
        };

        newRequestFactory(smartContractProxy, 'foo').then(() => done()).catch(done);
    });

    it('should resolve with the timeBeforeDisplay when closeRequest contains the PullRequestClaimed event', done => {
        const smartContractProxy = {
            newRequest: () => Promise.resolve([{
                event: 'PullRequestClaimed',
                args: {
                    timeBeforeDisplay: {
                        toNumber: () => 42,
                    },
                },
            }]),
        };

        newRequestFactory(smartContractProxy, 'foo')
            .then(timeBeforeDisplay => {
                expect(timeBeforeDisplay).to.equal(42);
                done();
            })
            .catch(done);
    });

    it('should resolve with the timeBeforeDisplay when closeRequest contains the PullRequestAlreadyClaimed event', done => {
        const smartContractProxy = {
            newRequest: () => Promise.resolve([{
                event: 'PullRequestAlreadyClaimed',
                args: {
                    timeBeforeDisplay: {
                        toNumber: () => 42,
                    },
                },
            }]),
        };

        newRequestFactory(smartContractProxy, 'foo')
            .then(timeBeforeDisplay => {
                expect(timeBeforeDisplay).to.equal(42);
                done();
            })
            .catch(done);
    });

    it('should reject with the "Invalid pull request id" message when closeRequest contains the InvalidPullRequest event', done => {
        const smartContractProxy = {
            newRequest: () => Promise.resolve([{
                event: 'InvalidPullRequest',
            }]),
        };

        newRequestFactory(smartContractProxy, 'foo')
            .then(() => {
                done('Should have been rejected');
            })
            .catch(err => {
                expect(err.message).to.equal('Invalid pull request id');
                done();
            });
    });
});

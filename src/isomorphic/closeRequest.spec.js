/* eslint-disable func-names */
import { expect } from 'chai';
import { closeRequest as closeRequestFactory } from './closeRequest';

describe('closeRequest', () => {
    it('should call the smartContractProxy.closeRequest function with the sendTransaction parameter', done => {
        const smartContractProxy = {
            closeRequest: sendTransaction => new Promise(resolve => {
                expect(sendTransaction).to.equal(true);
                resolve();
            }),
        };

        closeRequestFactory(smartContractProxy).then(done).catch(done);
    });

    it('should resolve its promise when no error is thrown', done => {
        const smartContractProxy = {
            closeRequest: () => Promise.resolve(),
        };

        closeRequestFactory(smartContractProxy).then(done).catch(done);
    });

    it('should reject its promise when an error is thrown', done => {
        const error = new Error('Run you fools !');

        const smartContractProxy = {
            closeRequest: () => Promise.reject(error),
        };

        closeRequestFactory(smartContractProxy)
            .then(() => done('Should have thrown error'))
            .catch(err => {
                expect(err).to.deep.equal(error);
                done();
            });
    });
});

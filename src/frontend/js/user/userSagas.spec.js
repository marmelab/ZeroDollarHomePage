import { expect } from 'chai';
import sinon from 'sinon';
import { call, put, take } from 'redux-saga/effects';
import { userActionTypes, signIn as signInActions } from './userActions';
import { routeActions } from 'react-router-redux';

describe('userSagas', () => {
    global.window = {
        location: {
            href: '',
        },
    };

    global.document = {
        cookie: '',
    };

    // We need to use require here instead of import because we're depending on hello.js which require a browser
    const userSagas = require('./userSagas');
    const signInWithGithub = sinon.spy();
    const signInSaga = userSagas.signIn(signInWithGithub);

    describe('signIn', () => {
        it('should call the fetchSignIn function after a SIGN_IN action', () => {
            const saga = signInSaga(signInActions.request());

            expect(saga.next().value).to.deep.equal(call(signInWithGithub));
        });

        it('should put the signedIn action after a succesfull signIn', () => {
            const saga = signInSaga(signInActions.request());

            saga.next();

            expect(saga.next({
                user: { id: 'foo'},
            }).value).to.deep.equal(put(signInActions.success({ id: 'foo'})));
        });

        it('should put the routeActions.push action after a succesfull signIn', () => {
            const saga = signInSaga(signInActions.request('/next-route'));

            saga.next();

            saga.next({
                user: { id: 'foo'},
            });

            expect(saga.next().value).to.deep.equal(put(routeActions.push('/next-route')));
        });

        it('should put the signIn action with error after a failed signIn', () => {
            const saga = signInSaga(signInActions.request('/next-route'));
            const error = new Error('Run you fools!');

            saga.next();

            expect(saga.next({
                error,
            }).value).to.deep.equal(put(signInActions.failure(error)));
        });
    });
});

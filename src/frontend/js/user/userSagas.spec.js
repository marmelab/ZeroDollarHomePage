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

    const userSagas = require('./userSagas');
    const signInSaga = userSagas.signIn;

    describe('signIn', () => {
        it('should starts on SIGN_IN action', () => {
            const saga = signInSaga();

            expect(saga.next(signInActions.request('/next-route')).value).to.deep.equal(take(userActionTypes.signIn.REQUEST));
        });

        it('should call the fetchSignIn function after a SIGN_IN action', () => {
            const fetchSignIn = sinon.spy();
            const saga = signInSaga(fetchSignIn);

            saga.next();

            expect(saga.next(signInActions.request('/next-route')).value).to.deep.equal(call(fetchSignIn));
        });

        it('should put the signedIn action after a succesfull signIn', () => {
            const fetchSignIn = sinon.spy();
            const storeLocalUser = sinon.spy();
            const saga = signInSaga(fetchSignIn, storeLocalUser);

            saga.next();
            saga.next(signInActions.request('/next-route'));

            expect(saga.next({
                user: { id: 'foo'},
            }).value).to.deep.equal(put(signInActions.success({ id: 'foo'})));
        });

        it('should put the routeActions.push action after a succesfull signIn', () => {
            const fetchSignIn = sinon.spy();
            const storeLocalUser = sinon.spy();
            const saga = signInSaga(fetchSignIn, storeLocalUser);

            saga.next();
            saga.next(signInActions.request('/next-route'));
            saga.next({
                user: { id: 'foo'},
            });

            expect(saga.next().value).to.deep.equal(put(routeActions.push('/next-route')));
        });

        it('should put the signIn action with error after a failed signIn', () => {
            const fetchSignIn = sinon.spy();
            const storeLocalUser = sinon.spy();
            const saga = signInSaga(fetchSignIn, storeLocalUser);
            const error = new Error('Run you fools!');

            saga.next();
            saga.next(signInActions.request('/next-route'));

            expect(saga.next({
                error,
            }).value).to.deep.equal(put(signInActions.failure(error)));
        });
    });
});

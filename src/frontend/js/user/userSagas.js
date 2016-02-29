import { call, fork, put, take } from 'redux-saga/effects';
import { routeActions } from 'react-router-redux';
import { signInWithGithub as signInWithGithubAPI, fetchSignIn as fetchSignInApi, fetchSignUp as fetchSignUpApi, storeLocalUser as storeLocalUserApi, removeLocalUser as removeLocalUserApi } from './userApi';
import { userActionTypes, signIn as signInActions, signOut as signOutActions, signUp as signUpActions } from './userActions';

export const signIn = function* signIn(signInWithGithub) {
    while (true) {
        const { payload } = yield take(userActionTypes.signIn.REQUEST);
        const { error, user } = yield call(signInWithGithub);

        if (error) {
            return yield put(signInActions.failure(error));
        }
        yield put(signInActions.success(user));
        yield put(routeActions.push(payload));
    }
};

export const signUp = function* signUp(fetchSignUp, storeLocalUser) {
    while (true) {
        const { payload: { email, password, previousRoute }} = yield take(userActionTypes.signUp.REQUEST);
        const { error, user } = yield call(fetchSignUp, email, password);
        if (error) {
            yield put(signUpActions.failure(error));
        } else {
            yield call(storeLocalUser, user);
            yield put(signUpActions.success(user));
            yield put(routeActions.push(previousRoute));
        }
    }
};

export const signOut = function* signOut(removeLocalUser) {
    while (true) {
        yield take(userActionTypes.signOut.REQUEST);
        yield call(removeLocalUser);
        yield put(signOutActions.success());
        yield put(routeActions.push('/'));
    }
};

const sagas = function* sagas() {
    yield fork(signIn, signInWithGithubAPI);
    yield fork(signUp, fetchSignUpApi, storeLocalUserApi);
    yield fork(signOut, removeLocalUserApi);
};

export default sagas;

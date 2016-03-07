import { call, fork, put, take } from 'redux-saga/effects';
import { routeActions } from 'react-router-redux';
import { signInWithGithub as signInWithGithubAPI } from './userApi';
import { userActionTypes, signIn as signInActions } from './userActions';

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


const sagas = function* sagas() {
    yield fork(signIn, signInWithGithubAPI);
};

export default sagas;

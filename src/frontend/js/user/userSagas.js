import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { routeActions } from 'react-router-redux';
import { signInWithGithub as signInWithGithubAPI } from './userApi';
import { userActionTypes, signIn as signInActions } from './userActions';

export const signIn = signInWithGithub => function* signInSaga({ payload }) {
    const { error, user } = yield call(signInWithGithub);

    if (error) {
        return yield put(signInActions.failure(error));
    }
    yield put(signInActions.success(user));
    yield put(routeActions.push(payload));
};


const sagas = function* sagas() {
    yield takeLatest(userActionTypes.signIn.REQUEST, signIn(signInWithGithubAPI));
};

export default sagas;

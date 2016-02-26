import { call, fork, put, take } from 'redux-saga/effects';
import claimActions, { claimActionTypes } from './claimActions';
import { fetchPullRequest, fetchClaim as fetchClaimApi } from './claimApi';
import { loadItemFactory } from '../app/entities/sagas';

export const loadPullRequest = loadItemFactory(claimActionTypes, claimActions);

export const claimPullRequest = function* claimPullRequest(getState, fetchClaim) {
    while (true) {
        const { payload: { repository, pullRequestNumber, image } } = yield take(claimActionTypes.claim.REQUEST);
        const { error, timeBeforeDisplay } = yield call(fetchClaim, repository, pullRequestNumber, image, getState().user.token);
        if (error) {
            yield put(claimActions.claim.failure(error));
        } else {
            yield put(claimActions.claim.success(timeBeforeDisplay));
        }
    }
};

const sagas = function* sagas(getState) {
    yield fork(loadPullRequest, fetchPullRequest);
    yield fork(claimPullRequest, getState, fetchClaimApi);
};

export default sagas;

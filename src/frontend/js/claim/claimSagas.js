import { call, fork, put, take } from 'redux-saga/effects';
import { routeActions } from 'react-router-redux';
import claimActions, { claimActionTypes } from './claimActions';
import { fetchPullRequest, fetchClaim as fetchClaimApi } from './claimApi';
import { loadItemFactory } from '../app/entities/sagas';

export const loadPullRequest = loadItemFactory(claimActionTypes, claimActions);

export const claimPullRequest = function* claimPullRequest(getState, fetchClaim) {
    const { payload: { repository, pullRequestNumber, image } } = yield take(claimActionTypes.claim.REQUEST);
    const { error, data } = yield call(fetchClaim, getState().user.token, repository, pullRequestNumber, image);
    if (error) {
        yield put(claimActions.failure(error));
    } else {
        yield put(claimActions.success(data));
        yield put(routeActions.push({
            pathname: 'claim-success',
            state: data,
        }));
    }
};

const sagas = function* sagas() {
    yield fork(loadPullRequest, fetchPullRequest);
    yield fork(claimPullRequest, fetchClaimApi);
};

export default sagas;

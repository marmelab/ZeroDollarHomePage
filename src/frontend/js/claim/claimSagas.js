import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import claimActions, { claimActionTypes } from './claimActions';
import { fetchPullRequest as fetchPullRequestApi, fetchClaim as fetchClaimApi } from './claimApi';
import { loadItemFactory } from '../app/entities/sagas';

export const loadPullRequest = fetchPullRequest => loadItemFactory(claimActionTypes, claimActions, fetchPullRequest);

export const claimPullRequest = (getState, fetchClaim) =>
    function* claimPullRequestSaga({ payload: { repository, pullRequestNumber, image } }) {
        const state = getState();

        if (!state || !state.user || !state.user.access_token) {
            return yield put(claimActions.claim.failure(new Error('You must authenticate with your github account first')));
        }

        const { error, timeBeforeDisplay } = yield call(fetchClaim, repository, pullRequestNumber, image, state.user.access_token);

        if (error) {
            yield put(claimActions.claim.failure(error));
        } else {
            yield put(claimActions.claim.success(timeBeforeDisplay));
        }
    };

const sagas = function* sagas(getState) {
    yield [
        takeLatest(claimActionTypes.item.REQUEST, loadPullRequest(fetchPullRequestApi)),
        takeLatest(claimActionTypes.claim.REQUEST, claimPullRequest(getState, fetchClaimApi)),
    ];
};

export default sagas;

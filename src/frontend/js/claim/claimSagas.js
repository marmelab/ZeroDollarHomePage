import { fork } from 'redux-saga/effects';
import claimActions, { claimActionTypes } from './claimActions';
import { fetchPullRequest } from './claimApi';
import { loadItemFactory } from '../app/entities/sagas';

export const loadPullRequest = loadItemFactory(claimActionTypes, claimActions);

const sagas = function* sagas() {
    yield fork(loadPullRequest, fetchPullRequest);
};

export default sagas;

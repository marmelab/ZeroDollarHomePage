import { fork } from 'redux-saga/effects';
import claimSagas from '../claim/claimSagas';
import userSagas from '../user/userSagas';

export default function* (getState) {
    yield fork(userSagas, getState);
    yield fork(claimSagas, getState);
}

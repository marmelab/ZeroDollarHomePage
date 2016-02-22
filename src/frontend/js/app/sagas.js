import { fork } from 'redux-saga/effects';
import userSagas from '../user/userSagas';

export default function* (getState) {
    yield fork(userSagas, getState);
}

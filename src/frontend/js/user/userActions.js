import { createAction } from 'redux-actions';
import createRequestActionTypes from '../app/entities/createRequestActionTypes';

export const userActionTypes = {
    signIn: createRequestActionTypes('SIGN_IN'),
};

export const signIn = {
    request: createAction(userActionTypes.signIn.REQUEST),
    success: createAction(userActionTypes.signIn.SUCCESS),
    failure: createAction(userActionTypes.signIn.FAILURE),
};

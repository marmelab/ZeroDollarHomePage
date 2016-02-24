import { createAction } from 'redux-actions';
import createRequestActionTypes from '../app/entities/createRequestActionTypes';

export const claimActionTypes = {
    item: createRequestActionTypes('PULL_REQUEST'),
};

export default {
    item: {
        request: createAction(claimActionTypes.item.REQUEST, (repository, pullRequestNumber) => ({ repository, pullRequestNumber })),
        success: createAction(claimActionTypes.item.SUCCESS),
        failure: createAction(claimActionTypes.item.FAILURE),
    },
};

import { createAction } from 'redux-actions';
import createRequestActionTypes from '../app/entities/createRequestActionTypes';

export const claimActionTypes = {
    claim: createRequestActionTypes('CLAIM'),
    item: createRequestActionTypes('PULL_REQUEST'),
};

export default {
    item: {
        request: createAction(claimActionTypes.item.REQUEST, (repository, pullRequestNumber) => ({ repository, pullRequestNumber })),
        success: createAction(claimActionTypes.item.SUCCESS),
        failure: createAction(claimActionTypes.item.FAILURE),
    },
    claim: {
        request: createAction(claimActionTypes.claim.REQUEST, (repository, pullRequestNumber, image) => ({ repository, pullRequestNumber, image })),
        success: createAction(claimActionTypes.claim.SUCCESS),
        failure: createAction(claimActionTypes.claim.FAILURE),
    },
};

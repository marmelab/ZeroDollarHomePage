import { claimActionTypes } from './claimActions';
import moment from 'moment';

const initialState = {
    claiming: false,
    claimError: null,
    timeBeforeDisplay: null,
    item: null,
    error: null,
    loading: false,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case claimActionTypes.item.REQUEST:
        return {
            ...state,
            loading: true,
        };

    case claimActionTypes.item.SUCCESS:
        return {
            ...state,
            item: payload,
            error: null,
            loading: false,
        };

    case claimActionTypes.item.FAILURE:
        return {
            ...state,
            item: null,
            error: payload,
            loading: false,
        };

    case claimActionTypes.claim.REQUEST:
        return {
            ...state,
            claiming: true,
            timeBeforeDisplay: null,
        };

    case claimActionTypes.claim.SUCCESS:
        return {
            ...state,
            timeBeforeDisplay: payload,
            claimError: null,
            claiming: false,
        };

    case claimActionTypes.claim.FAILURE:
        return {
            ...state,
            claimError: payload,
            timeBeforeDisplay: null,
            claiming: false,
        };

    default:
        return state;
    }
};

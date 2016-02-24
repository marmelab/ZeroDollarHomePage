import { claimActionTypes } from './claimActions';

const initialState = {
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

    default:
        return state;
    }
};

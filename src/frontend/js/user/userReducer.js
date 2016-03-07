import { userActionTypes } from './userActions';

export default function() {
    const initialState = {
        authenticated: false,
        loading: false,
    };

    return (state = initialState, { type, payload }) => {
        switch (type) {
        case userActionTypes.signIn.REQUEST:
            return {
                ...state,
                authenticated: false,
                error: false,
                loading: true,
            };

        case userActionTypes.signIn.SUCCESS:
            return {
                ...state,
                ...payload,
                authenticated: true,
                error: false,
                loading: false,
            };

        case userActionTypes.signIn.FAILURE:
            return {
                authenticated: false,
                error: payload,
                loading: false,
            };

        default:
            return state;
        }
    };
}

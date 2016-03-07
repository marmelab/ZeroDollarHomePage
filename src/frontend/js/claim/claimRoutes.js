import Claim from './Claim';
import redirectIfNotAuthenticatedFactory from '../user/redirectIfNotAuthenticated';

export default store => {
    const redirectIfNotAuthenticated = redirectIfNotAuthenticatedFactory(store);

    return [{
        path: 'claim',
        component: Claim,
        onEnter: redirectIfNotAuthenticated,
    }];
};

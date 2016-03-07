import App from './App';
import claimRoutesFactory from '../claim/claimRoutes';
import userRoutes from '../user/userRoutes';

export default store => {
    return {
        component: 'div',
        childRoutes: [{
            path: '/',
            component: App,
            childRoutes: [
                ...claimRoutesFactory(store),
                ...userRoutes,
            ],
        }],
    };
};

import App from './App';
import claimRoutes from '../claim/claimRoutes';
import userRoutes from '../user/userRoutes';

export default store => {
    return {
        component: 'div',
        childRoutes: [{
            path: '/',
            component: App,
            childRoutes: [
                ...claimRoutes,
                ...userRoutes,
            ],
        }],
    };
};

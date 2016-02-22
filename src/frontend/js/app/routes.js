import App from './App';
import userRoutes from '../user/userRoutes';

export default store => {
    return {
        component: 'div',
        childRoutes: [{
            path: '/',
            component: App,
            childRoutes: [
                ...userRoutes,
            ],
        }],
    };
};

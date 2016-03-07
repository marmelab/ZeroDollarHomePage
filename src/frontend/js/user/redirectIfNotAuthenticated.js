export default (store) => {
    return (nextState, replace) => {
        const { user: { authenticated }} = store.getState();

        if (!authenticated) {
            replace({
                pathname: '/sign-in',
                state: { nextPath: nextState.location.pathname + (nextState.location.search ? nextState.location.search : '') },
            });
        }
    };
};

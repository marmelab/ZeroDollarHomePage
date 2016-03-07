import { expect } from 'chai';
import { signIn, userActionTypes } from './userActions';

describe('userActions', () => {
    it('signIn.request should return the correct action', () => {
        expect(signIn.request('/route')).to.deep.equal({
            type: userActionTypes.signIn.REQUEST,
            payload: '/route',
        });
    });

    it('signIn.success should return the correct action', () => {
        expect(signIn.success({ id: 'id_test', email: 'test_email', token: 'test_token' })).to.deep.equal({
            type: userActionTypes.signIn.SUCCESS,
            payload: { id: 'id_test', email: 'test_email', token: 'test_token' },
        });
    });

    it('signIn.failure should return the correct action', () => {
        const error = new Error('Run you fools !');

        expect(signIn.failure(error)).to.deep.equal({
            type: userActionTypes.signIn.FAILURE,
            payload: error,
            error: true,
        });
    });
});

import {expect} from 'chai';
import sinon from 'sinon';
import reducerFactory from './userReducer';
import { signIn } from './userActions';

describe('user reducer', () => {
    it('should handle the signIn.request action', () => {
        const reducer = reducerFactory();

        expect(reducer(undefined, signIn.request())).to.deep.equal({
            authenticated: false,
            error: false,
            loading: true,
        });
    });

    it('should handle the signIn.success action', () => {
        const reducer = reducerFactory();

        expect(reducer(undefined, signIn.success({
            email: 'foo@bar.com',
            id: 'foo',
            token: 'bar',
        }))).to.deep.equal({
            authenticated: true,
            error: false,
            id: 'foo',
            email: 'foo@bar.com',
            loading: false,
            token: 'bar',
        });
    });

    it('should handle the signIn.failure action', () => {
        const reducer = reducerFactory();
        const error = new Error('Run you fools!');
        expect(reducer(undefined, signIn.failure(error))).to.deep.equal({
            authenticated: false,
            loading: false,
            error,
        });
    });
});

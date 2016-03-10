import { expect } from 'chai';
import getReponseCodeMessage from './getReponseCodeMessage';

describe('getReponseCodeMessage', () => {
    it('should returns the correct message for code 0', () => {
        expect(getReponseCodeMessage(0)).to.equal('Ok');
    });

    it('should returns the correct message for code 1', () => {
        expect(getReponseCodeMessage(1)).to.equal('Invalid pull request identifier');
    });

    it('should returns the correct message for code 2', () => {
        expect(getReponseCodeMessage(2)).to.equal('Invalid pull request author name');
    });

    it('should returns the correct message for code 3', () => {
        expect(getReponseCodeMessage(3)).to.equal('Request not found');
    });

    it('should returns the correct message for code 4', () => {
        expect(getReponseCodeMessage(4)).to.equal('Empty queue');
    });
});

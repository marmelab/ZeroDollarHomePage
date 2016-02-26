import { expect } from 'chai';
import { updateImageJob } from './cron';

describe('cron', () => {
    describe('updateImageJob', () => {
        it('should update the current file passing the last non published imageUrl', function*(done) {
            yield updateImageJob(function* () {
                return true;
            }, function* (){
                return {
                    code: 0,
                    imageUrl: 'foo',
                };
            }, function *(imageUrl) {
                expect(imageUrl).to.equal('foo');
                done();
            });
        });
    });
});

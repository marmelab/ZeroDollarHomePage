/* eslint-disable func-names */
import { expect } from 'chai';
import { updateImageJob } from './cron';

describe('cron', () => {
    describe('updateImageJob', () => {
        it('should update the current file passing the last non published imageUrl', function* (done) {
            try {
                yield updateImageJob(function* () {
                    return true;
                }, function* () {
                    return 'foo';
                }, function* (imageUrl) {
                    expect(imageUrl).to.equal('foo.jpg');
                    done();
                });
            } catch (err) {
                done(err);
            }
        });
    });
});

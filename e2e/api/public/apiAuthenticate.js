/* eslint func-names:0 */

describe('/api/sign-in', () => {
    before(function* addFixtures() {
        yield fixtureLoader.loadDefaultFixtures();
    });

    describe('GET', () => {
        it('should not allow GET request', function* () {
            const { statusCode } = yield request({
                method: 'PUT',
                url: '/api/sign-in',
            });
            assert.equal(statusCode, 405);
        });
    });
    describe('PUT', () => {
        it('should not allow PUT request', function* () {
            const { statusCode } = yield request({
                method: 'PUT',
                url: '/api/sign-in',
            });
            assert.equal(statusCode, 405);
        });
    });
    describe('DELETE', () => {
        it('should not allow DELETE request', function* () {
            const { statusCode } = yield request({
                method: 'DELETE',
                url: '/api/sign-in',
            });
            assert.equal(statusCode, 405);
        });
    });

    after(function* clearFixtures() {
        yield fixtureLoader.removeAllFixtures();
    });
});

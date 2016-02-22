import config from 'config';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import uuid from 'uuid';
import crypto from 'crypto';

import data from '../fixtures/demo_fixtures.json';
import userFactory from '../../src/api/users/userModel';

export default function(client) {
    const userQueries = userFactory(client);

    function* loadDefaultFixtures() {
        yield userQueries.batchInsert(data.users);
    }

    function* removeAllFixtures() {
        yield client.query_('TRUNCATE user_account RESTART IDENTITY');
    }

    function* getTokenFor(email) {
        // const causes an error! don't know why
        const user = yield userQueries.findByEmail(email);
        delete user.id;

        return jwt.sign(user, config.apps.api.security.jwt.privateKey);
    }

    function* getCookieTokenFor(email) {
        const token = yield getTokenFor(email);

        return crypto.createHmac('sha256', config.apps.api.security.secret)
            .update(token)
            .digest('hex');
    }

    return {
        loadDefaultFixtures,
        removeAllFixtures,
        getTokenFor,
        getCookieTokenFor,
    };
}

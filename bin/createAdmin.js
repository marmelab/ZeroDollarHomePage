/* eslint-disable no-console */

import co from 'co';
import config from 'config';
import dbClient from '../src/api/lib/db/client';
import userRepositoryFactory from '../src/api/users/userModel';

const args = process.argv.slice(2);

co(function* createAdmin() {
    const connection = yield dbClient(config.apps.api.db);
    const userRepository = userRepositoryFactory(connection.client);

    const user = yield userRepository.insertOne({
        email: args[1],
        password: args[2],
    });

    console.log('\n');
    console.log(user);
    process.exit();
}).catch(err => {
    console.error(err.message);
    process.exit();
});

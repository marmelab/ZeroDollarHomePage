module.exports = {
    apps: {
        api: {
            db: {
                host: 'DB_HOST',
                user: 'DB_USER',
                password: 'DB_PASSWORD',
                database: 'DB_NAME',
            },
            github: {
                username: '',
                password: '',
            },
            // or
            // github: {
            //      id: 'abcdefghijklmno',
            //      secret: 'abcdefghijk',
            // },
            //
            // or
            // github: 'access_token',
            githubHook: {
                host: 'localhost',
                // port: 3000,
            },
        },
    },
};

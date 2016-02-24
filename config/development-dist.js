module.exports = {
    apps: {
        api: {
            db: {
                host: 'localhost',
                user: 'postgres',
                password: undefined,
                database: 'boilerplate',
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
        frontend: {
            history: 'createHashHistory',
        },
    },
    logs: {
        app: {
            Console: { timestamp: true, colorize: true, level: 'info' },
        },
        http: {
            Console: { timestamp: true, colorize: true },
        },
    },
};

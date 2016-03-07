module.exports = {
    apps: {
        api: {
            db: {
                host: 'localhost',
                user: 'postgres',
                password: undefined,
                database: 'boilerplate',
            },
            frontendUrl: 'http://localhost:8080/frontend',
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
            s3: {
                apiKey: '',
                secret: '',
                bucket: '',
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
    oauth: {
        githubClientId: '',
    },
};

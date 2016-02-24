var apiUrl = 'http://localhost:3010'; // eslint-disable-line no-var
var frontendUrl = 'http://localhost:8081'; // eslint-disable-line no-var

module.exports = {
    apps: {
        admin: {
            api_url: apiUrl + '/admin/',
        },
        api: {
            allowOrigin: [frontendUrl],
            db: {
                host: 'localhost',
                user: 'postgres',
                password: '',
                database: 'travis_ci_test',
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
            security: {
                rateLimitOptions: {
                    max: 99,
                },
                xdomain: {
                    master: {
                        base_url: frontendUrl,
                    },
                },
            },
        },
        frontend: {
            api_url: apiUrl + '/api',
            history: 'createHashHistory',
        },
    },
};

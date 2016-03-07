var apiPort = process.env.NODE_PORT || 3000; // eslint-disable-line no-var
var apiUrl = 'http://localhost:' + apiPort; // eslint-disable-line no-var
var frontendUrl = 'http://localhost:8080'; // eslint-disable-line no-var
var blockchainProvider = process.env.BLOCKCHAIN_PROVIDER || 'eris'; // eslint-disable-line no-var

module.exports = {
    appName: 'Zero Dollar Home Page',
    apps: {
        admin: {
            api_url: apiUrl + '/admin/',
        },
        api: {
            allowOrigin: [frontendUrl],
            frontendUrl: frontendUrl,
            db: {
                driver: 'pg',
                host: 'DB_HOST',
                port: 5432,
                user: 'DB_USER',
                password: 'DB_PASSWORD',
                database: 'DB_NAME',
            },
            github: {
                username: '',
                password: '',
            },
            githubHook: {
                host: 'localhost',
                // port: 3000,
            },
            s3: {
                apiKey: '',
                secret: '',
                bucket: '',
            },
            logs: {
                app: {Console: { timestamp: true, colorize: true, level: 'error' }},
                http: {},
            },
            cookies: {
                secure: false,
                secureProxy: false,
                httpOnly: false,
                signed: false,
                overwrite: true,
            },
            port: apiPort,
            security: {
                expirationTokenDelay: 1800, // in seconds
                bcrypt: {
                    salt_work_factor: 10, // higher is safer, but slower
                },
                jwt: {
                    privateKey: 'MY-VERY-PRIVATE-KEY',
                },
                secret: 'MY-VERY-SECRET-CRYPTO-KEY-DIFFERENT-FROM-JWT',
                xdomain: {
                    master: {
                        base_url: frontendUrl,
                    },
                    slave: {
                        base_url: apiUrl,
                        debug: true,
                        path: '/xdomain',
                    },
                },
                rateLimitOptions: {},
            },
            cron: {
                enabled: true,
                schedule: '00 00 * * *', // every day at midnight
            },
        },
        frontend: {
            api_url: apiUrl + '/api',
            enableDevTools: true,
            history: 'createBrowserHistory',
        },
        // or
        // github: {
        //      id: 'abcdefghijklmno',
        //      secret: 'abcdefghijk',
        // },
        //
        // or
        // github: 'access_token',
    },
    blockchain: {
        provider: blockchainProvider, // eris or ethereum
        eris: {
            url: 'http://localhost:1337/rpc',
            account_path: __dirname + '/../.eris/account.json',
        },
        ethereum: {
            url: 'http://localhost:8545',
        },
    },
    oauth: {
        domain: frontendUrl,
        githubClientId: '',
        githubClientSecret: '',
    },
    babel_ignore: /node_modules\/(?!admin-config|fakerest)/,
};

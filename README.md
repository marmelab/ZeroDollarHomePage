# ZeroDollarHomePage

## Install

Requirements:

* Node.js V5
* PostgreSQL
* ethereum-cpp (see [instructions](https://gavofyork.gitbooks.io/turboethereum/content/chapter1.html))
* A blockchain provider (see [instructions](doc/BLOCKCHAIN_SETUP.md))

```sh
# install npm dependencies and Selenium (for tests)
make install
```

## Configuration

### Github oAuth

You'll need to create a Github application at https://github.com/settings/developers
then copy/paste the **Client Id** and **Client Secret** into your configuration file
(`development.js` or `production.js`):

```js
oauth: {
    githubClientId: 'Your Client ID',
    githubClientSecret: 'Your Client Secret',
},
```

### Github API

For the application to have access to the Github API, you'll need to provide a
way to authenticate with Github in the configuration file (`development.js` or
`production.js`).

This can be:

- A `login`/`password` to an account which can access the repositories on which
you configured the hooks
- An access token (Follow the [instructions](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
to create one) created from an account with access to the repositories on which
you configured the hooks

### Github hooks

You'll need to setup the Github hooks for the repositories you want to be
watched by the application.
- Go to your repository settings, **Webhooks & services**
- Add a new webhook by entering `[API_URL]:3420/github/callback` in the **Payload URL** field (Port `3420` is important!)
- Leave the **secret** field empty (verification is not implemented yet. PR are welcome !)
- Select the **Just the push event.** option

That's it. Repeat for every repositories you want to bind.

### Ethereum

Create a file named `.ethereum` and put your default ethereum account address in it.

Starts a private ethereum network for development by running:
```sh
make start-ethereum
```

A miner must be running on this network to allow contracts deployment and blockchain operations through those contracts.
Starts the miner by running:
```sh
make run-ethereum-miner
```

Deploying the contract is done by running:
```sh
make deploy-contracts-ethereum
```

## Develop

```sh
# start servers (node and webpack via pm2)
make run-dev
# both servers will run in the background
# the Node server uses nodemon and will restart on code change
# the frontend is served by webpack dev server with hot reload

# you can restart either the api or the frontend by hand
make restart-api
make restart-frontend
```

Browse the app:

* [http://localhost:8080/admin](http://localhost:8080/admin) for the admin app
* [http://localhost:8080/frontend](http://localhost:8080/frontend) for the frontend app
* [http://localhost:3000](http://localhost:3000) for the API

```sh
# stop servers (node and webpack)
make stop-dev
```

Note: for stability purposes, it's a good practice to not upgrade your project dependencies using major updates.
It's why you should locally run `npm set prefix='~'` and not add dependencies prefixed with a carret `^` without good reason.

## Test

```sh
# tests run in the "test" environment and don't empty the "development" database
make test

# alternately, you can run any of the individual test suites:
make test-api-unit
make test-api-functional
make test-frontend-unit
make test-frontend-functional
make test-isomorphic-unit
make test-ethereum
```

API (and common lib) unit tests using:

* [Mocha](http://mochajs.org/)
* expect from [Chai](http://chaijs.com/guide/styles/)

API functional tests using:

* [Mocha](http://mochajs.org/)
* expect from [Chai](http://chaijs.com/guide/styles/)
* [request](https://github.com/request/request)

Frontend unit tests using:

* [Mocha](http://mochajs.org/)
* [expect](https://github.com/mjackson/expect)
* [Redux Thunk](https://github.com/gaearon/redux-thunk), [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) and [nock](https://github.com/pgte/nock)
to test redux action creators (as explain in [redux documentation](http://rackt.org/redux/docs/recipes/WritingTests.html))
* [enzyme](https://github.com/airbnb/enzyme) to test react components

Frontend fonctional tests using:

* [Nightwatch.js](http://nightwatchjs.org/)


## Deployment

See [deployment instructions](doc/DEPLOY.md).


## Managing servers with PM2

dev and tests servers are managed with PM2. So, It's possible to :

```sh
# display the 'front dev' server's logs
make log-frontend-dev
# display the 'api dev' server's logs
make log-api-dev

# display the list of all servers
make servers-list
# display the monitoring for all servers
make servers-monitoring
# stop all servers
make servers-stop-all
# stop all servers, delete them, and clear their logs.
make servers-clear-all
```

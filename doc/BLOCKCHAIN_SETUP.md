# Setup a blockchain

In order to install the project, you can install either Ethereum or Eris blockchain technology.

The API will remain the same in all cases: the point is to run a blockchain and create a node which communicate with your application through RPC protocol.

See [configurations files](../config/default.js) for more details.

## Eris Industries

The default blockchain provider, it runs a sandbox blockchain with Docker.

[Install the `eris` command tool](https://docs.erisindustries.com/tutorials/getting-started/), then you can simply run:

```bash
# Install and run a blockchain called 'zerodollar' and send smart contracts into
make init-blockchain && make deploy-contracts

# Run the stopped blockchain
make run-blockchain
# Stop the blockchain
make stop-blockchain
# See blockchain's logs
make log-blockchain
# Delete the blockchain from your computer
make delete-blockchain
```

If you are stuck with eris or if you simply want to delete all and restart, just type `make flush-eris && eris init`.

For more informations about Eris Industries and its blockchain management, see [these tutorials](https://docs.erisindustries.com/tutorials/).


## Ethereum

First of all, be sure to have Go-lang installed on your computer.

Then, install `geth` client by running `bash <(curl -L https://install-geth.ethereum.org)` (see [the documentation](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) for specific case)

After that, you can run a node with a command like
```bash
geth --datadir="/tmp/eth/10/01" --ipcdisable --networkid 42 --rpc console 2>> /tmp/eth/10/01.log
```

**Be sure to specify a `--networkid` different of `1` which is [the real Ethereum network available here](https://ethstats.net/).**

Note that your node (the `geth` command above) needs to keep running while your application is switched on.

Finally, change your configuration to use Ethereum blockchain or run your app with the following environment variable `BLOCKCHAIN_PROVIDER=ethereum`.

For more information about Ethereum, see the [Frontier website](https://ethereum.org/).

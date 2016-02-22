# Ethereum setup

First of all, install Go-lang.

Then, install `geth` client by running `bash <(curl -L https://install-geth.ethereum.org)` (see [the documentation](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) for specific case)

After that, you can run a node with a command like
```bash
geth --datadir="/tmp/eth/60/01" -verbosity 6 --ipcdisable --port 30301 --rpcport 8101 --networkid 916267` console 2>> /tmp/eth/60/01.log
```

Each node need to have a unique port, datadir and rpcport but should have the same networkid in order to communicate wich each others.

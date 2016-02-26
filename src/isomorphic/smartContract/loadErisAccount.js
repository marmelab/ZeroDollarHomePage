export default (filePath) => {
    const account = require(filePath);

    return {
        ...account,
        pubKey: account.pub_key,
        privKey: account.priv_key,
    };
};

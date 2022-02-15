// const IPFS = require('ipfs-http-client');
const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// use infuria IPFS node to instantie this IPFS instance

export default ipfs;
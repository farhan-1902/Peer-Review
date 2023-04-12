const Peer = artifacts.require('../contracts/Peer.sol');

module.exports = function (deployer) {
    deployer.deploy(Peer);
}
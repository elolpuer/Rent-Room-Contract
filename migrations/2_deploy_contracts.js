const Rent = artifacts.require('./Rent.sol')

module.exports = function(deployer) {
  deployer.deploy(Rent);
};

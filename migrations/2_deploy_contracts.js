const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const Rent = artifacts.require('./Rent.sol')

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Rent);
};

const warXToken = artifacts.require('./WarXToken.sol');

module.exports = async function (deployer, network, accounts) {

  const _name = 'WarX Token';
  const _symbol = 'WARX';
 
  await deployer.deploy(warXToken,_name,_symbol);

  const deployedToken = await warXToken.deployed();
  console.log(`*****deployed warXToken`, deployedToken.address)
}
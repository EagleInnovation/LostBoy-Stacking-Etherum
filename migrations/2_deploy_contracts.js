// const LostBoyTest = artifacts.require('../contracts/LostBoyTest.sol');
const LostStaking = artifacts.require('../contracts/LostStaking.sol');
// const LostToken = artifacts.require('../contracts/LostToken.sol');
// const Lostgirl = artifacts.require('../contracts/Lostgirl.sol');

module.exports = async function (deployer) {
    // await deployer.deploy(LostBoyTest,'Lost Boy Test','LBT','https://api.lostboy.io/boy/');
    // await deployer.deploy(LostToken);
    // await deployer.deploy(Lostgirl,'Lostgirl','LOSTG','https://api.lostboy.io/girl/');
    await deployer.deploy(LostStaking, "0xB76F20449Ed199EC62bC29fc1F8C4514963BAA40", "0xF7F9877C39AE47a2062F26F8Fd77EDF0a42FD007", 10, "0x0627FC292d1e4C28207B8C66626652c51562fe2b",[115,135,150,175,200],[4000,2750,1500,1000]);
    
}

40*1*1.35

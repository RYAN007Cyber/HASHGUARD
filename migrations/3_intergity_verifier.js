const SystemIntegrity = artifacts.require("./SystemIntegrity.sol");

module.exports = function (deployer) {
  const initialHash =
    "DAF1D642B187141933DF586E77CD2B6332907C4F196F3381819CF39E36F344F2";
  deployer.deploy(SystemIntegrity, initialHash);
};

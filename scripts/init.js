const Web3 = require('web3');


function init_web3(){
  const provider = new Web3.providers.HttpProvider('http://localhost:9545');

  const web3 = new Web3(provider);
  return web3;
}


module.exports = init_web3;

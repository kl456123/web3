async function deploy_contract(web3, contract_code){
  const abi = contract_code.abi;
  const bytecode = contract_code.evm.bytecode.object;
  const MyTokenContract = new web3.eth.Contract(abi, null, {data: '0x'+bytecode});
  let accounts = await web3.eth.getAccounts();

  // estimate gas fee
  const estimate_gas = await MyTokenContract.deploy().estimateGas();
  const average_gas_prices = await web3.eth.getGasPrice();

  let instance = await MyTokenContract.deploy().send({
    from: accounts[0],
    gas: estimate_gas,
    gasPrice: average_gas_prices
  });
  console.log('contract deployed at: ', instance.options.address);
  return instance;
}

module.exports = deploy_contract;

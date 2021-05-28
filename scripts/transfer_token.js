const init_web3 = require('./init');
const compile_sol = require('./compile_sol');
const deploy_contract = require('./deploy_contract');



async function get_contract(web3, abi, address){
  const contract = new web3.eth.Contract(abi, address);
  return contract;
}

async function call_contract(web3, instance){
  // listen on events
  instance.events.Transfer({fromblock:0}, (err, event)=>{
    console.log("log event: ", event);
  });

  let accounts = await web3.eth.getAccounts();
  // instance.methods.balanceOf(accounts[0]).call((err, result) => { console.log(result) });
  // member variables in contract
  instance.methods.totalSupply().call((err, result) => { console.log('total supply: ', result) });

  // transfer tokens, two ways to send transactions
  instance.methods.balanceOf(accounts[1]).call((err, result) => { console.log('transfered before: ', result) });
  instance.methods.sendTokens(accounts[1], 200).send(
    {
      from: accounts[0],
      gas: 800000,
      gasPrice: web3.utils.toWei('10', 'gwei'),
    },
    (err, transaction_hash) => { console.log('transaction hash: ', transaction_hash) }
  );

  // use transaction style
  // const tx = {
  // from: accounts[0],
  // to: instance.options.address,
  // gas: 800000,
  // gasPrice: web3.utils.toWei('10', 'gwei'),
  // data: instance.methods.sendTokens(accounts[1], 2000).encodeABI()
  // };
  // await web3.eth.sendTransaction(tx);
  instance.methods.balanceOf(accounts[1]).call((err, result) => { console.log('transfered after: ', result) });

  // change value
  instance.methods.value().call((err, result)=>{
    console.log("value before: ", result);
  });
  await instance.methods.store(50).send({from: accounts[0]},
    (err, transaction_hash) => { console.log('transaction hash: ', transaction_hash) }
  );
  instance.methods.value().call((err, result)=>{
    console.log("value after: ", result);
  });
}

async function main(){
  const web3 = init_web3();
  const contract_code = compile_sol();
  // switch the flag when use the contract
  const first_flag = true;
  let contract_instance;
  let address = "0x0239581ebAf124c1810d34cFf291077A4D3Bd3A1";

  if(first_flag){
    // runs only for the first time
    contract_instance = await deploy_contract(web3, contract_code);
  }else{
    // then use the deployed contract
    contract_instance = await get_contract(web3, contract_code.abi, address);
  }

  // call contract
  await call_contract(web3, contract_instance);

  // get all events
  contract_instance.getPastEvents(
    'allEvents',
    {
      fromBlock: 0,
      toBlock: 'latest'
    },
    (err, events) => { console.log(events) }
  )
  // contract_instance.events.Transfer({fromBlock:0}, (err, event)=>{
    // console.log(event);
  // })
}


main()




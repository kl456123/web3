const Web3 = require('web3');
const fs = require('fs');

const options = {
    transactionConfirmationBlocks: 1,
    // transactionBlockTimeout: 5,
    // transactionPollingTimeout: 480
};

let web3 = new Web3(Web3.givenProvider || "http://localhost:8545", null, options);

function getContractByLoadOrCompile(path, compile=false){
  let Contract;
  if(compile){
    let json = {
      language: 'Solidity',
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    json['sources'] = {};
    json['sources'][filename] = {
      content: content
    };

    let json_str = JSON.stringify(json);
    let output = JSON.parse(solc.compile(json_str));
    return output.contracts[filename][contract_name];

  }else{
    let output = JSON.parse(fs.readFileSync(path, 'utf-8'));
    Contract = new web3.eth.Contract(output.abi, null/* address */, {data: output.bytecode, gas: "9999999"}/* options */);
  }

  return Contract;
}

// let erc20Contract;

async function checkAccount(name, account){
  // eth
  console.log(name, ': ', await web3.eth.getBalance(account));
  // erc20 token
}

async function main(){
  const accounts = await web3.eth.getAccounts();
  const alice = accounts[0];
  const bob = accounts[1];

  // transfer test
  await checkAccount('alice', alice);
  await checkAccount('bob', bob);
  await web3.eth.sendTransaction({from: alice, to: bob, value: web3.utils.toWei('1', 'ether')});
  await checkAccount('alice', alice);
  await checkAccount('bob', bob);

  // contract
  // deploy it first
  const ERC20 = getContractByLoadOrCompile('./build/contracts/MockToken.json');
  let erc20Contract = await ERC20.deploy({arguments:["MT", "MockToken", alice, "1000000000000000000000"]}).send({from: alice});
  console.log('contract deployed at: ', erc20Contract.options.address);

  // call
  console.log('MT balance of alice: ', await erc20Contract.methods.balanceOf(alice).call());
  // send
  await erc20Contract.methods.transfer(bob, "100000000000000000000").send({from: alice});
  console.log('MT balance of alice: ', await erc20Contract.methods.balanceOf(alice).call());
  // mint to test revert
  // await erc20Contract.methods.mint(bob, "100000000000000000000").send({from: alice});
  // promise
  erc20Contract.methods.mint(bob, "100000000000000000000").send({from: alice}).on('transactionHash', hash=>{
    console.log(hash);
  }).on('confirmation', function(confirmationNumber, receipt){
  }).on('receipt', receipt=>{
    console.log(receipt);
  }).on('error', (error, receipt)=>{
    // bug here
    console.log(receipt);
  });
}



main().then(console.log).catch(console.error);

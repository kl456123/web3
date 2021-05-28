const Web3 = require('web3');

let web3 = new Web3(Web3.givenProvider || "http://localhost:9545");

async function main(){
  let accounts = await web3.eth.getAccounts();
  let from = accounts[0];
  let to = accounts[1];
  transaction = {from: from ,to :to,  value:web3.utils.toWei("0.5", "ether")};

  web3.eth.getBalance(accounts[0], (err, wei)=>{
    console.log(wei)
  });
  web3.eth.getBalance(accounts[1], (err, wei)=>{
    console.log(wei)
  });

  web3.eth.sendTransaction(transaction).then(receipt=>{
    console.log(receipt);
  });

  web3.eth.getBalance(accounts[0], (err, wei)=>{
    console.log(wei)
  });
  web3.eth.getBalance(accounts[1], (err, wei)=>{
    console.log(wei)
  });

}

main()

const fs = require('fs');
const solc = require('solc');


function compile_sol(){

  const filename = 'my_token.sol';
  const contract_name = 'MyToken';
  const contract_path = './contracts/my_token.sol'
  let content = fs.readFileSync(contract_path, 'utf-8');

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

  // console.log(output.contracts[filename][contract_name].abi);
  // console.log(output.contracts[filename][contract_name].evm.bytecode.object);
  return output.contracts[filename][contract_name];
}


module.exports = compile_sol;




pragma solidity ^0.6.6;


contract MyToken{
    address public creator;
    uint256 public totalSupply;

    uint256 public value;
    mapping (address => uint256) public balances;

    // Emitted when the stored value changes
    event Transfer(address from,  address to, uint256 amount);

    constructor() public{
        creator = msg.sender;
        totalSupply = 10000;
        balances[creator] = totalSupply;
        value = 10;
    }

    function balanceOf(address owner) public view returns(uint256){
        return balances[owner];
    }

    function store(uint256 amount) public {
      value = amount;
    }

    function sendTokens(address receiver, uint256 amount) public returns(bool){
        address owner = msg.sender;

        require(amount>0);
        require(balances[owner]>amount);

        balances[owner]-=amount;
        balances[receiver] += amount;

        emit Transfer(owner, receiver, amount);
        return true;
    }
}




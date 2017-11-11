pragma solidity ^0.4.16;

contract Faucet {
    mapping(address => uint) usersTime;
    uint sleepTime = 1 minutes; // or can write .. minutes
    uint amount = 500000000000000000;
    
    modifier canReceiveMoney() {
        if (this.balance < amount) {
            throw;
        }
        if (usersTime[msg.sender] == 0) {
            _;
        }
        if (now - usersTime[msg.sender] >= sleepTime) {
            _;
        }
    }
    
    function replenish() payable {}

    function getAmount() constant returns(uint) {
        return amount;
    }
    
    function getContractBalance() constant returns(uint) {
        return this.balance;
    }
    
    function giveMoney() canReceiveMoney {
        if (msg.sender.send(amount)) {
            usersTime[msg.sender] = now;
        }
    }
    
    function timeRemain() constant returns(uint) {
        if (now - usersTime[msg.sender] >= sleepTime) {
            return 0;
        }
        return usersTime[msg.sender] + sleepTime - now;
    }
}
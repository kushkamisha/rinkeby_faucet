// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import faucet_artifacts from '../../build/contracts/Faucet.json'

var Faucet = contract(faucet_artifacts);

function getContractBalance() {
    Faucet.setProvider(web3.currentProvider);
    Faucet.deployed().then(function(contractInstance) {
        contractInstance.getContractBalance.call().then(function(v) {
           $("#getContractBalance").html(web3.fromWei(v.toString()));
        });
    });
}

function timeRemain() {
    // let address = $("input[name=address]").val();
    let address = '0x9eD53b5d4521cB05989Df7618A8e66FbFFCAe952';
    Faucet.setProvider(web3.currentProvider); // important
    Faucet.deployed().then(function(contractInstance) {
        contractInstance.timeRemain({from: address}).then(function(v) {
           return Number(v);
        });
    });
}

// function canGetMoney() {
//     Faucet.setProvider(web3.currentProvider);
//     let amount = 0, val = 0, flag = false;
//     Faucet.deployed().then(function(contractInstance) {
//         contractInstance.getContractBalance.call().then(function(v) {
//             val = Number(v);
//             contractInstance.getAmount.call().then(function(a) {
//                 amount = Number(a);
//                 if (val > amount + 140000) {
//                     alert('here');
//                     flag = true;
//                 }
//                 alert(flag);
//             });
//         });
    
//     alert(flag);
//     return false;
//     });
// }

window.replenish = function(amount) {
    try {
        if (amount == -1) {
            amount = $("input[name=amount]").val();
            amount = amount.replace(',', '.');
            if (isNaN(parseFloat(amount))) {
                alert('Incorrect repelnish amount!');
            }
        }
        amount = Number(amount);

        let address = $("input[name=send-address]").val();

        $("#msg").html("Thank you for replenish faucet's wallet. The balance will increase as soon as the transaction is recorded on the blockchain. Please wait.");
        Faucet.deployed().then(function(contractInstance) {
            contractInstance.replenish({from: address, value: web3.toWei(amount)}).then(function() {
                $("#msg").html("");
                getContractBalance();
            });
        });
    } catch(err) {
        console.log(err);
    }
}

window.giveMoney = function() {
    try {
        let address = $("input[name=address]").val();
        $("#msg").html("We send some money to your address. When miners confirm this transaction you'll see refreshed balance.");
        Faucet.deployed().then(function(contractInstance) {
            contractInstance.giveMoney({gas: 140000, from: address}).then(function() {
                $("#msg").html("");
                getContractBalance();
            });
        });
    } catch (err) {
        console.log(err);
    }
}

$(document).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  alert(timeRemain());
  getContractBalance();
});
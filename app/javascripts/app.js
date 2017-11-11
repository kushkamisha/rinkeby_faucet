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

window.replenish = function(amount) {
    Faucet.deployed().then(function(contractInstance) {
        contractInstance.replenish({from: web3.eth.accounts[0], value: web3.toWei(0.1)}).then(function(v) {
            console.log(Number(v))
        });
    });
}

// window.giveMoney = function() {
//     // timeRemain();
//     try {
//         let address = $("input[name=address]").val();
//         alert(address);
//         $("#msg").html("We send some money to your address. When miners confirm this transaction you'll see refreshed balance.");
//         Faucet.deployed().then(function(contractInstance) {
//             contractInstance.giveMoney({gas: 140000, from: address}).then(function() {
//                 $("#msg").html("");
//                 getContractBalance();
//             });
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// function timeRemain() {
//     let address = $("input[name=address]").val();
//     Faucet.deployed().then(function(contractInstance) {
//         contractInstance.timeRemain.call({from: address}).then(function(v) {
//             alert(Number(v));
//         });
//     });
// }

function getContractBalance() {
  Faucet.setProvider(web3.currentProvider);
  Faucet.deployed().then(function(contractInstance) {
    contractInstance.getContractBalance.call().then(function(v) {
      $("#getContractBalance").html(web3.fromWei(v.toString()));
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  getContractBalance();
});
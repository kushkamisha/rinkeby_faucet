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

function canGetMoney() {
    Faucet.setProvider(web3.currentProvider);
    let amount = 0, val = 0;
    Faucet.deployed().then(function(contractInstance) {
        contractInstance.getContractBalance.call().then(function(v) {
            val = Number(v);
            contractInstance.getAmount.call().then(function(a) {
                amount = Number(a);
                let address = $("input[name=address]").val();
                // let address = '0x9eD53b5d4521cB05989Df7618A8e66FbFFCAe952';

                contractInstance.timeRemain({from: address}).then(function(t) {
                    if ((val > amount + 140000) && Number(t) == 0) {
                        $("#temp").html('true');
                    } else {
                        $("#temp").html('false');
                    }
                });
            });
        });
    });
}

window.replenish = function(amount) {
    try {
        if (amount == -1) {
            amount = $("input[name=amount]").val();
            amount = amount.replace(',', '.');
            if (isNaN(parseFloat(amount))) {
                alertWindow(4, 'Incorrect repelnish amount!');
            }
        }
        amount = Number(amount);
        // alert(amount);
        let address = $("input[name=send-address]").val();

        alertWindow(1, "Thank you for replenish faucet's wallet. The balance will increase as soon as the transaction is recorded on the blockchain. Please wait.");
        Faucet.deployed().then(function(contractInstance) {
            contractInstance.replenish({from: address, value: web3.toWei(amount)}).then(function() {
                getContractBalance();
            });
        });
    } catch(err) {
        console.log(err);
    }
}

window.giveMoney = function() {
    canGetMoney();
    let can_get = ($("#temp").text() == 'true');
    // let can_get = Boolean($("#temp").text());
    // alert(can_get);
    try {
        if (can_get) {
            let address = $("input[name=address]").val();
            alertWindow(1, "We send some money to your address. When miners confirm this transaction you'll see refreshed balance.");
            Faucet.deployed().then(function(contractInstance) {
                contractInstance.giveMoney({gas: 140000, from: address}).then(function() {
                    getContractBalance();
                });
            });
        } else {
            alertWindow(3, 'You must wait ' + time_to_wait + ' seconds before receiving more money.');
        }
    } catch (err) {
        console.log(err);
    }
}

function alertWindow(n, text) {
    // switch(n) {
    //     case 1:
    //         $('.alert-success').css("display", "block");
    //         $('.alert-success span').html(text);
    //         break;
    //     case 2:
    //         $('.alert-info').css("display", "block");
    //         $('.alert-info span').html(text);
    //         break;
    //     case 3:
    //         $('.alert-warning').css("display", "block");
    //         $('.alert-warning span').html(text);
    //         break;
    //     case 4:
    //         $('.alert-danger').css("display", "block");
    //         $('.alert-danger span').html(text);
    //         break;
    // }
    alert(text);
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
  canGetMoney();
  getContractBalance();
});
// const { default: Web3 } = require("web3");

console.log("hello world");


window.userWalletAddress = null;

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

const userWallet = document.getElementById("userWallet");

// will gray out and display alternate message if metamask is not installed
function toggleButton() {
  if (!window.ethereum) {
    loginButton.innerText = "MetaMask is not installed";
    loginButton.classList.remove("goodButton");
    loginButton.classList.add("badButton");
    return false;
  }

  // click event for when user does have metamask downloaded
  loginButton.addEventListener("click", loginWithMetaMask);
}

// gets accounts array
async function loginWithMetaMask() {
  const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((e) => {
      console.error(e.message);
      return;
    });
  if (!accounts) {
    return;
  }
  // Returns first account
  const account = accounts[0];
  window.userWalletAddress = account;
  // displays user account address
  userWallet.innerText = window.userWalletAddress;

  // displays logout button, removes display of login button
  loginButton.style.display = "none";
  logoutButton.style.display = "flex";
  logoutButton.addEventListener("click", signOutMetaMask);
}

// removes account text and logout button, displays login again
async function signOutMetaMask() {
  window.userWalletAddress = null;
  userWallet.innerText = "";
  logoutButton.style.display = "none";
  loginButton.style.display = "flex";
}

// checks if window has MetaMask after dom loads
window.addEventListener("DOMContentLoaded", () => {
  toggleButton();
  console.log("DOM fully loaded and parsed");
});


// // import web3 js
const web3 = new Web3(window.ethereum)
console.log("web3 loaded", web3)

// // endpoint to get connected to ethereum node 
// const web3 = new Web3("")

// // private key to send transactions
// web3.eth.accounts.wallet.add("")

// // to get ether balance of an address
// web3.eth.getBalance("")
// .then(balance => console.log(balance))
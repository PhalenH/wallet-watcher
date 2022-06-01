console.log("hello world");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userEtherBalance = document.getElementById("userEtherBalance");

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

// function to retrivew balance and display it
function getEtherBalance(balanceUrl) {
  fetch(balanceUrl)
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      userEtherBalance.innerText = data.result;
    });
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
  console.log(accounts);
  const account = accounts[0];
  let myAddress = account;
  // displays user account address
  userWallet.innerText = myAddress;

  // url to request account balance
  let requestEtherScan = `https://api.etherscan.io/api?module=account&action=balance&address=${myAddress}&tag=latest&apikey=Z1RS12PR6955ZK5SBXV6HGUEJG5GR2721W`;
  // url to get
  // let 

  getEtherBalance(requestEtherScan);

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

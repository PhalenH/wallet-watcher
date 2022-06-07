console.log("hello world");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userEtherBalance = document.getElementById("userEtherBalance");
const tokenNameContainer = document.getElementById("token-list-name");
const tokenPriceContainer = document.getElementById("token-list-price");
const tokenHoldingContainer = document.getElementById("token-list-holding");
const ethereumBalance = document.getElementById("userEtherBalance");

const userWallet = document.getElementById("userWallet");
// url to get all Tokens from coinGecko
let getUrl = "https://api.coingecko.com/api/v3/coins/list?include_platform=true";

let tokenArr = [];

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

// function to retrieve balance and display it
function getEtherBalance(balanceUrl) {
  fetch(balanceUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      userEtherBalance.innerText = data.result;
    });
}

// function to retrieve full list of tokens from coinGecko
function geckoTokens(getUrl) {
  fetch(getUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // loops through data, if ethereum is platform used, adds it to array and logs it
      for (let i = 0; i < data.length; i++) {
        if (data[i].platforms.ethereum) {
          tokenArr.push(data[i]);
        }
      }
      console.log(tokenArr);
      return tokenArr;
    });
}

// function to retrieve token market cap from top 250 tokens using coinGecko
function geckoTokenMarket(marketUrl) {
  fetch(marketUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      geckoTokens(getUrl);
      // console.log(tokenArr)

      for (let i = 0; i < data.length; i++) {
        // create elements
        let tokenName = document.createElement("li");
        let tokenPrice = document.createElement("li");
        // add content
        tokenName.className = "list-item";
        tokenName.textContent = data[i].name;
        tokenPrice.className = "list-item";
        tokenPrice.textContent = "$" + data[i].current_price.toFixed(2);
        // append child to parent
        tokenNameContainer.append(tokenName);
        tokenPriceContainer.append(tokenPrice);
      }
    });
}

// function to retrieve token address via token id
function geckoAddress(addressUrl) {
  fetch(addressUrl)
    .then((response) => {
      // console.log(response.json);
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // console.log(data);
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
  // url to get top 250 coins in market
  let marketUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=1000&page=1";
  // url to get coins by id and get contract address
  let addressUrl = `https://api.coingecko.com/api/v3/simple/token_price/bitcoin`;
  // currently getting a 422 error

  getEtherBalance(requestEtherScan);
  geckoTokenMarket(marketUrl);
  geckoAddress(addressUrl);

  // displays logout button, removes display of login button
  loginButton.style.display = "none";
  logoutButton.style.display = "inline";
  logoutButton.addEventListener("click", signOutMetaMask);
}

// removes account text and logout button, displays login again
async function signOutMetaMask() {
  window.userWalletAddress = null;
  userWallet.innerText = "";
  logoutButton.style.display = "none";
  // console.log(document.querySelectorAll(".list-item"))
  let listItems = document.querySelectorAll(".list-item");
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].remove();
  }
  userEtherBalance.innerText = "";
  tokenArr = [];

  loginButton.style.display = "inline";
}

// checks if window has MetaMask after dom loads
window.addEventListener("DOMContentLoaded", () => {
  toggleButton();
  // console.log("DOM fully loaded and parsed");
});

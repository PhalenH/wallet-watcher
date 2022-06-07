console.log("hello world");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userEtherBalance = document.getElementById("userEtherBalance");
const tokenNameContainer = document.getElementById("token-list-name");
const tokenPriceContainer = document.getElementById("token-list-price");
const tokenHoldingContainer = document.getElementById("token-list-holding");

const userWallet = document.getElementById("userWallet");
// url to get all Tokens from coinGecko
let getUrl =
  "https://api.coingecko.com/api/v3/coins/list?include_platform=true";
// url to get top 250 coins in market
let marketUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=1000&page=1";

let tokenArr = [];
let topTokenArr = [];
let tokenName = [];
let finalDisplay = [];

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

  // returns tokenName list of top 250 tokens' name
  geckoTokenMarket(marketUrl);
  // returns tokenArr list of all tokens with ethereum platform
  geckoTokens(getUrl);
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

// function to retrieve user's current balance of an ERC-20 token
function getUserToken(getUserTokenUrl) {
  fetch(getUserTokenUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // returns amount only if user is holding some amount of that token
      if (data.result > 0) {
        return data.result;
      }
    });
}

// function to retrieve full list of tokens from coinGecko
async function geckoTokens(getUrl) {
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
          tokenArr.push({
            id: data[i].id,
            address: data[i].platforms.ethereum,
          });
        }
      }
      // console.log(tokenArr);
      return tokenArr;
    });
}

// function to retrieve token market cap from top 250 tokens using coinGecko
async function geckoTokenMarket(marketUrl) {
  fetch(marketUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // console.log(data);
      // console.log(tokenArr);
      data.forEach((name) => tokenName.push(name.id));
      // console.log(tokenName);
    });
}

// function to compare tokenArr and TokenName to return top 250 which have the platform ethereum
function compareTwoArr() {
  for (let i = 0; i < tokenName.length; i++) {
    for (let j = 0; j < tokenArr.length; j++) {
      if (tokenName[i].indexOf(tokenArr[j].id) != -1) {
        topTokenArr.push({ id: tokenName[i], address: tokenArr[j].address });
      }
    }
  }
  console.log(topTokenArr);
  return topTokenArr;
}

// creates and appends list items for tokens that user is holding  to designed unordered lists
function displayContent() {
  for (let i = 0; i < finalDisplay.length; i++) {
    // create elements
    let tokenName = document.createElement("li");
    let tokenAmount = document.createElement("li");
    // add content
    tokenName.className = "list-item";
    tokenName.textContent = data[i].name;
    tokenAmount.className = "list-item";
    tokenAmount.textContent = data[i].amount;
    // append child to parent
    tokenNameContainer.append(tokenName);
    tokenHoldingContainer.append(tokenAmount);
  }
}

// gets accounts array
async function loginWithMetaMask() {
  compareTwoArr();
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

  //TODO: add to env file
  let apiKey = "Z1RS12PR6955ZK5SBXV6HGUEJG5GR2721W";

  // url to request account balance
  let requestEtherScan = `https://api.etherscan.io/api?module=account&action=balance&address=${myAddress}&tag=latest&apikey=${apiKey}`;

  // Returns the current balance of an ERC-20 token of an address.
  // let getUserTokensUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${myAddress}&tag=latest&apikey=${apiKey}`;

  for (let i = 0; i < topTokenArr.length; i++) {
    let getUserTokensUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${topTokenArr[i].address}&address=${myAddress}&tag=latest&apikey=${apiKey}`;
    console.log(getUserTokensUrl);
    // if(getUserToken(getUserTokensUrl) > 0){
    //   finalDisplay.push({ name: topTokenArr[i].name , amount: getUserToken(getUserTokensUrl)})
    // }
  }

  getEtherBalance(requestEtherScan);
  displayContent();
  // displays logout button, removes display of login button
  loginButton.style.display = "none";
  logoutButton.style.display = "inline";
  logoutButton.addEventListener("click", signOutMetaMask);
}

// removes account text and logout button, displays login again
async function signOutMetaMask() {
  location.reload();
}

// checks if window has MetaMask after dom loads
window.addEventListener("DOMContentLoaded", () => {
  toggleButton();
  // console.log("DOM fully loaded and parsed");
});

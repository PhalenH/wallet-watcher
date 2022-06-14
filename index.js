console.log("hello ");

// HTML tags to reference in functions
const loginButton = document.getElementById("loginButton");
const displayTokenButton = document.getElementById("displayTokenButton");
const logoutButton = document.getElementById("logoutButton");
const loginMessage = document.getElementById("login-message");
const ListContainerHeader = document.getElementById("list-container-header");
const userEtherBalance = document.getElementById("userEtherBalance");
const tokenNameContainer = document.getElementById("token-list-name");
const tokenHoldingContainer = document.getElementById("token-list-holding");
// const tokenPriceContainer = document.getElementById("token-list-price");
const userWallet = document.getElementById("userWallet");

// establish arrays to be given values later
let tokenArr = [];
let topTokenArr = [];
let tokenName = [];
let tokenAddressArr = [];
let finalDisplay = [];

// Grays out and display alternate message for button if metamask is not installed
function toggleButton() {
  if (!window.ethereum) {
    loginButton.innerText = "MetaMask is not installed";
    loginButton.classList.remove("goodButton");
    loginButton.classList.add("badButton");
    return false;
  }

  // click event for when user does have metamask downloaded
  loginButton.addEventListener("click", loginWithMetaMask);

  // url to get top 250 coins in market
  let marketUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=1000&page=1";
  // returns tokenName list of top 250 tokens' name
  geckoTokenMarket(marketUrl);
  // url to get all Tokens from coinGecko
  let getUrl =
    "https://api.coingecko.com/api/v3/coins/list?include_platform=true";
  // returns tokenArr list of all tokens with ethereum platform
  geckoTokens(getUrl);
}

// function to retrieve full list of tokens from coinGecko, loops through data, if ethereum is platform used, adds it to tokenArr array
async function geckoTokens(getUrl) {
  fetch("/api/coingecko")
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      console.log("coingecko data", data);
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

// function to retrieve token market cap from top 250 tokens using coinGecko, loops through data and adds it to tokenName array
async function geckoTokenMarket(marketUrl) {
  fetch(marketUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // console.log(data);
      data.forEach((name) => tokenName.push(name.id));
      // console.log(tokenName);
    });
}

// function to compare tokenArr and TokenName to return top 250 which use the platform ethereum
async function compareTwoArr() {
  for (let i = 0; i < tokenName.length; i++) {
    for (let j = 0; j < tokenArr.length; j++) {
      if (tokenName[i].indexOf(tokenArr[j].id) != -1) {
        topTokenArr.push({ id: tokenName[i], address: tokenArr[j].address });
      }
    }
  }
  return topTokenArr;
}

// function to retrieve balance and display it
async function getEtherBalance(balanceUrl) {
  fetch(balanceUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      userEtherBalance.innerText = data.result;
    });
}

// function to retrieve user's current balance of an ERC-20 token
async function getUserToken(getUserTokenUrl) {
  fetch(getUserTokenUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // returns amount only if user is holding some amount of that token
      if (data.result >= 0) {
        console.log(data.result);
        return data.result;
      }
    });
}

async function checkifTokenExists() {
  // Promise.all()
  for (let i = 0; i < tokenAddressArr.length; i++) {
    console.log(tokenAddressArr[i]);
    // if (getUserToken(tokenAddressArr[i]) >= 0) {
    //   console.log("working");
    //   finalDisplay.push({ name: topTokenArr[i].name , amount: getUserToken(getUserTokensUrl)})
    // }
  }
}

// creates and appends list items for tokens that user is holding  to designed unordered lists
async function displayContent() {
  for (let i = 0; i < finalDisplay.length; i++) {
    // create elements
    let tokenName = document.createElement("li");
    let tokenAmount = document.createElement("li");
    // add content
    tokenName.textContent = finalDisplay[i].name;
    tokenAmount.textContent = finalDisplay[i].amount;
    // append child to parent
    tokenNameContainer.append(tokenName);
    tokenHoldingContainer.append(tokenAmount);

    console.log("last");
  }
}

// gets accounts array
async function loginWithMetaMask() {
  await compareTwoArr();
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
  let myAddress = account;
  // displays user account address
  userWallet.innerText = myAddress;

  let apiKey = "Z1RS12PR6955ZK5SBXV6HGUEJG5GR2721W";
  // url to request account balance
  let requestEtherScan = `https://api.etherscan.io/api?module=account&action=balance&address=${myAddress}&tag=latest&apikey=${apiKey}`;
  // fetches api to retrieve ethereum balance
  getEtherBalance(requestEtherScan);

  // Returns the current balance of an ERC-20 token of an address.
  async function returnUserTokenArr() {
    for (let i = 0; i < topTokenArr.length; i++) {
      let getUserTokensUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${topTokenArr[i].address}&address=${myAddress}&tag=latest&apikey=${apiKey}`;
      tokenAddressArr.push(getUserTokensUrl);
    }
    // console.log(tokenAddressArr);
  }
  await returnUserTokenArr();
  await checkifTokenExists();

  // displays logout button, removes display of login button
  loginButton.style.display = "none";
  loginMessage.style.display = "none";
  logoutButton.style.display = "inline";
  displayTokenButton.style.display = "inline";
  logoutButton.addEventListener("click", signOutMetaMask);
  displayTokenButton.addEventListener("click", viewTokenList);
}

async function viewTokenList() {
  console.log("hello");
  await displayContent();
  displayTokenButton.style.display = "none";
  ListContainerHeader.style.display = "inline";
}
// reloads page which resets arrays as well as text provided from js script
async function signOutMetaMask() {
  location.reload();
}

// checks if window has MetaMask after dom loads
window.addEventListener("DOMContentLoaded", () => {
  toggleButton();
  console.log("DOM fully loaded and parsed");
});

// let getUserTokensUrl1 = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x58b6a8a3302369daec383334672404ee733ab239&address=${myAddress}&tag=latest&apikey=${apiKey}`;
// let getUserTokensUrl2 = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xb056c38f6b7dc4064367403e26424cd2c60655e1&address=${myAddress}&tag=latest&apikey=${apiKey}`;
// await getUserToken(getUserTokensUrl1);
// await getUserToken(getUserTokensUrl2);

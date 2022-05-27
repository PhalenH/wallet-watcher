console.log("hello world");

window.userWalletAddress = null;

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

const userWallet = document.getElementById("userWallet");

function toggleButton() {
  if (!window.ethereum) {
    loginButton.innerText = "MetaMask is not installed";
    loginButton.classList.remove("goodButton");
    loginButton.classList.add("badButton");
    return false;
  }

  loginButton.addEventListener("click", loginWithMetaMask);
}

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
  const account = accounts[0];
  window.userWalletAddress = account;
  userWallet.innerText = window.userWalletAddress;

  loginButton.style.display = "none";
  logoutButton.style.display = "flex";
  logoutButton.addEventListener("click", signOutMetaMask);
}

async function signOutMetaMask() {
  window.userWalletAddress = null;
  userWallet.innerText = "";
  logoutButton.style.display = "none";
  loginButton.style.display = "flex";
}

window.addEventListener("DOMContentLoaded", () => {
  toggleButton();
  console.log("DOM fully loaded and parsed");
});

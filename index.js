console.log("hello world");

window.useWalletAddress = null

const loginButton = document.getElementById("loginButton");

function toggleButton() {
  if (!window.ethereum) {
    loginButton.innerText = "MetaMask is not installed";
    loginButton.classList.remove("goodButton");
    loginButton.classList.add("badButton");
    return false;
  }

  loginButton.addEventListener("click", loginWithMetaMask)
}

async function loginWithMetaMask() {
   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
   .catch((e)=> {
       console.error(e.message)
       return
   })
   const account = accounts[0];
   window.useWalletAddress = account
}

window.addEventListener("DOMContentLoaded", () => {
    toggleButton()
  console.log("DOM fully loaded and parsed");
});

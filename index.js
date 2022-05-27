console.log("hello world")

const loginButton = document.getElementById("loginButton")

function toggleButton() {
    if (!window.ethereum) {
        loginButton.innerText = "MetaMask is not installed"
        loginButton.classList.remove()
        loginButton.classList.add()
    }
}
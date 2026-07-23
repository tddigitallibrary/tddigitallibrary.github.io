const container = document.getElementById("formContainer");

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

btnRegister.onclick = function () {

    container.classList.remove("login");
    container.classList.add("register");

    btnRegister.classList.add("active");
    btnLogin.classList.remove("active");

}

btnLogin.onclick = function () {

    container.classList.remove("register");
    container.classList.add("login");

    btnLogin.classList.add("active");
    btnRegister.classList.remove("active");

}
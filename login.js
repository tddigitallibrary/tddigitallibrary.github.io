function login(){

    let email = document.getElementById("email").value;
    
    let password = document.getElementById("password").value;
    
    if(email=="" || password==""){
    
    alert("Isi email dan password");
    
    return;
    
    }
    
    alert("Login berhasil");
    
    }
window.goRegister = function(){

window.location = "register.html";

}
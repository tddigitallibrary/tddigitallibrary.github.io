window.login = async function(){

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    
    try{
    
    let userCred = await signInWithEmailAndPassword(auth,email,password);
    
    let uid = userCred.user.uid;
    
    // ambil role
    let userDoc = await getDoc(doc(db,"users",uid));
    
    if(!userDoc.exists()){
    alert("User belum terdaftar di database");
    return;
    }
    
    let role = userDoc.data().role;
    
    alert("Login berhasil sebagai: " + role);
    
    // redirect
    if(role === "admin"){
    window.location.href = "admin.html";
    }else{
    window.location.href = "user.html";
    }
    
    }catch(e){
    
    alert("Login gagal: " + e.message);
    console.log(e);
    
    }
    
    };

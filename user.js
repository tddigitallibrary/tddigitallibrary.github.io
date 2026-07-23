import { db, auth } from "./firebase.js";

import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// LOGOUT
window.logout = async function(){

try{
await signOut(auth);
window.location.href = "index.html";
}catch(e){
console.log(e);
}

};

/* ==========================================
   DASHBOARD STATISTIK
========================================== */

function loadDashboard(){

    // ===========================
    // TOTAL BARANG
    // ===========================

    onSnapshot(collection(db,"barang"), (snapshot)=>{

        let totalBarang = 0;

        snapshot.forEach((doc)=>{

            totalBarang += Number(doc.data().jumlah || 0);

        });

        let el = document.getElementById("totalBarang");

        if(el){

            el.innerHTML = totalBarang;

        }

    });


    // ===========================
    // PEMINJAMAN
    // ===========================

    onSnapshot(collection(db,"peminjaman"), (snapshot)=>{

        let dipinjam = 0;

        let kembali = 0;

        snapshot.forEach((doc)=>{

            let data = doc.data();

            if(data.status === "dipinjam"){

                dipinjam++;

            }

            if(data.status === "dikembalikan"){

                kembali++;

            }

        });

        let pinjam = document.getElementById("totalPinjam");

        if(pinjam){

            pinjam.innerHTML = dipinjam;

        }

        let ret = document.getElementById("totalReturn");

        if(ret){

            ret.innerHTML = kembali;

        }

    });

}

// PINJAM (dummy dulu)
window.pinjam = async function(id, namaBarang, stokBarang){

    try{

        const user = auth.currentUser;

        if(!user){

            alert("Silakan login terlebih dahulu.");

            return;

        }

        // Ambil jumlah yang dipilih
        const qty = Number(
            document.getElementById(`qty-${id}`).value
        );

        if(isNaN(qty) || qty <= 0){

            alert("Jumlah pinjam tidak valid.");

            return;

        }

        if(qty > stokBarang){

            alert("Jumlah melebihi stok.");

            return;

        }

        // Ambil data user
        const userRef = doc(db,"users",user.uid);

        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()){

            alert("Data user tidak ditemukan.");

            return;

        }

        const dataUser = userSnap.data();

        // Ambil data barang terbaru
        const barangRef = doc(db,"barang",id);

        const barangSnap = await getDoc(barangRef);

        if(!barangSnap.exists()){

            alert("Barang tidak ditemukan.");

            return;

        }

        const stokSekarang = barangSnap.data().jumlah;

        if(qty > stokSekarang){

            alert("Stok sudah berubah.");

            return;

        }

        // Simpan peminjaman
        await addDoc(collection(db,"peminjaman"),{

            uid:user.uid,

            nama:dataUser.nama,

            kelas:dataUser.kelas,

            email:dataUser.email,

            barang:namaBarang,

            barangID:id,

            jumlah:qty,

            status:"dipinjam",

            tanggal:new Date(),

            timestamp:Date.now()

        });

        // Kurangi stok
        await updateDoc(barangRef,{

            jumlah:stokSekarang-qty

        });

        alert("Peminjaman berhasil.");

    }

    catch(err){

        console.log(err);

        alert("Gagal meminjam.");

    }

}
// LOAD DATA
function load(){

const list = document.getElementById("list");

onSnapshot(collection(db,"barang"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(doc=>{

let data = doc.data();

let jenis = data.jenis || "Umum";

let isHabis = data.jumlah <= 0;
let warna = isHabis ? "red" : "#10b981";

list.innerHTML += `
<div class="item-card">

    <div class="item-top">

        <div class="item-icon">
            <i class="fa-solid fa-box"></i>
        </div>

        <div class="badge">
            ${jenis}
        </div>

    </div>

    <div class="item-info">

        <div class="item-title">
            ${data.nama}
        </div>

        <div class="stock ${isHabis ? "empty" : "available"}">
            ${isHabis ? "❌ Habis" : "✔ Tersedia"} (${data.jumlah})
        </div>

    </div>

    <div class="item-action">

        <div class="qty-box">

            <label>Jumlah</label>

            <input
                type="number"
                min="1"
                max="${data.jumlah}"
                value="1"
                id="qty-${doc.id}"
            >

        </div>

        <button
            class="btn-pinjam"
            ${isHabis ? "disabled" : ""}
            onclick="pinjam('${doc.id}','${data.nama}',${data.jumlah})"
        >
            <i class="fa-solid fa-hand-holding"></i>
            Pinjam
        </button>

    </div>

</div>
`;

});

});

}

loadDashboard();
load();

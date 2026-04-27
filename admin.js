import { db, auth } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
onSnapshot,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// DARK MODE
window.toggleDark = () => {
document.body.classList.toggle("dark");
};

// MODAL
window.showTambah = () => {
document.getElementById("modal").style.display="block";
};

window.tutupModal = () => {
document.getElementById("modal").style.display="none";
};

// LOGOUT
window.logout = async () => {
await signOut(auth);
location.href="index.html";
};

// TAMBAH BARANG
window.tambahBarang = async () => {

let nama = document.getElementById("namaBarang").value;
let jumlah = document.getElementById("jumlahBarang").value;

await addDoc(collection(db,"barang"),{
nama:nama,
jenis,
jumlah:parseInt(jumlah)
});

loadData();
};

window.showPage = function(page){

document.getElementById("barangPage").style.display = "none";
document.getElementById("peminjamanPage").style.display = "none";
    
if(page === "barang"){
document.getElementById("barangPage").style.display = "block";
}else{
document.getElementById("peminjamanPage").style.display = "block";
}
    
};

// LOAD DATA
async function loadData(){

let table = document.getElementById("table");
table.innerHTML="";

let total=0, habis=0;

let snap = await getDocs(collection(db,"barang"));

snap.forEach(d=>{
let data=d.data();
total++;

let status = data.jumlah==0 ? "Habis" : "Available";
if(data.jumlah==0) habis++;

table.innerHTML += `
<tr>
<td>${data.nama}</td>
<td>${data.jenis || "-"}</td>
<td>${data.jumlah}</td>
<td>
<button onclick="openModal('${d.id}', ${JSON.stringify(data).replace(/"/g,'&quot;')})">
Edit
</button>
</td>
</tr>
`;
});

document.getElementById("totalBarang").innerText=total;
document.getElementById("stokHabis").innerText=habis;

};

let chart;

// ========================
// LOAD GRAFIK REALTIME
// ========================
function loadGrafik(){

onSnapshot(collection(db,"peminjaman"), (snapshot)=>{

let dataMap = {};

snapshot.forEach(d=>{

let data = d.data();

// hanya hitung yang dipinjam
if(data.status === "dipinjam"){

if(dataMap[data.barang]){
dataMap[data.barang]++;
}else{
dataMap[data.barang] = 1;
}

}

});

updateChart(dataMap);

});

}

function loadPeminjaman(){

const table = document.getElementById("tablePinjam");

onSnapshot(collection(db,"peminjaman"), (snapshot)=>{

table.innerHTML = "";

snapshot.forEach(doc=>{

let data = doc.data();

table.innerHTML += `
<tr>
<td>${data.nama || "-"}</td>
<td>${data.nama_user || "-"}</td>
<td>${data.barang || "-"}</td>
<td>${data.jumlah || 1}</td>
</tr>
`;

});

});

}
loadPeminjaman();
// ========================
// UPDATE CHART
// ========================
function updateChart(data){

let labels = Object.keys(data);
let values = Object.values(data);

if(chart){
chart.destroy();
}

chart = new Chart(document.getElementById("chart"),{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Jumlah Dipinjam",
data:values
}]
}
});

}


// INIT
loadGrafik();

let editId = null;

// buka modal
window.openModal = function(id=null,data=null){
document.getElementById("modal").style.display="block";

if(data){
editId = id;
document.getElementById("nama").value = data.nama;
document.getElementById("jenis").value = data.jenis;
document.getElementById("jumlah").value = data.jumlah;
}else{
editId = null;
}
};

window.tutup = function(){
document.getElementById("modal").style.display="none";
};

// SIMPAN (ADD / UPDATE)
window.pinjam = async function(id,namaBarang,stok){

let qty = parseInt(document.getElementById(`qty-${id}`).value);

// validasi
if(qty <= 0){
alert("Jumlah tidak valid!");
return;
}

if(qty > stok){
alert("Stok tidak cukup!");
return;
}

try{

let user = auth.currentUser;

// 1. simpan ke peminjaman
await addDoc(collection(db,"peminjaman"),{
nama: user.displayName || "User",
email: user.email,
barang: namaBarang,
barangID: id,
jumlah: qty,
status: "dipinjam",
tanggal: new Date().toLocaleDateString()
});

// 2. kurangi stok
let ref = doc(db,"barang",id);
let snap = await getDoc(ref);

await updateDoc(ref,{
jumlah: snap.data().jumlah - qty
});

alert("Berhasil meminjam!");

}catch(e){
console.log(e);
alert("Gagal meminjam");
}

};
    
window.search = function(keyword){
    
let rows = document.querySelectorAll("#table tr");
    
rows.forEach(r=>{
let text = r.innerText.toLowerCase();
r.style.display = text.includes(keyword.toLowerCase())
? "" : "none";
});
    
};
loadData();

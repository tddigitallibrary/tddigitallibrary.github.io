async function loadStatistik(){

    let bukuSnap = await getDocs(collection(db,"buku"));
    
    let pinjamSnap = await getDocs(collection(db,"peminjaman"));
    
    let totalBuku = bukuSnap.size;
    
    let totalPinjam = 0;
    
    let tersedia = 0;
    
    bukuSnap.forEach((b)=>{
    
    let data = b.data();
    
    tersedia += data.stok;
    
    });
    
    pinjamSnap.forEach((p)=>{
    
    if(p.data().status=="dipinjam"){
    
    totalPinjam++;
    
    }
    
    });
    
    document.getElementById("totalBuku").innerText = totalBuku;
    
    document.getElementById("totalPinjam").innerText = totalPinjam;
    
    document.getElementById("bukuTersedia").innerText = tersedia;
    
    }
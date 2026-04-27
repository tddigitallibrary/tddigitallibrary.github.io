// DARK MODE
document.getElementById("toggleDark").onclick = function(){

    document.body.classList.toggle("dark");
    
    };
    
    
    // CHART
    const ctx = document.getElementById("chart");
    
    new Chart(ctx,{
    
    type:"bar",
    
    data:{
    labels:["Proyektor","Spidol","Laptop"],
    datasets:[{
    label:"Peminjaman",
    data:[5,3,2]
    }]
    }
    
    });
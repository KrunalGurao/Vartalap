const baseServerUrl = 'http://localhost:8998/admin'

const spanEl = document.querySelector('#welcomeMsg');
const logoutBtn = document.querySelector('#logoutFn');
const container = document.querySelector('#adminList');
const trafficContainer = document.querySelector('#trafficContainer');
const ctx = document.getElementById('myChart').getContext('2d');
const loading = document.getElementById('loading');
const twoMostUsedRoutes = document.querySelector('.routeContainer');
const queryString = window.location.search;
let urlParams = decodeURIComponent(queryString);
localStorage.getItem('token')||localStorage.setItem('token', urlParams.split('"')[1]);

setTimeout(()=>{
    loading.style.display = 'none'
}, 3000);

const token = localStorage.getItem('token');
window.addEventListener('load', ()=>{
    if(!token) window.location.href = 'login.html'
    else{
        display();
        fillContainer();
        creatingChart();
        twoStar();
    }
})


const display = async ()=>{
    let admin = await fetch(`${baseServerUrl}/adminInfo`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!admin.ok){
        Swal.fire('Working fine')
        localStorage.clear();
        setTimeout(()=>{
            window.location.href = 'login.html';
        }, 5500);
    }else{
        admin = await admin.json();
        localStorage.setItem('admin', admin.name);
        localStorage.setItem('email', admin.email);
        localStorage.setItem('role', admin.role);
        localStorage.setItem('icon', admin.icon);
        let first = admin.name.split(' ')[0];
        spanEl.innerText = `Welcome back, ${first}`;
    }
}

const twoStar = async ()=>{
    let data = await fetch(`${baseServerUrl}/topTwoRoutes`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    data = await data.json();
    console.log(data);
    let arr = data.map(mostTraffic)
    console.log(arr.join('\n'));
    twoMostUsedRoutes.innerHTML = arr.join('\n');
}

const mostTraffic = (el)=>{
    let str = `
    <div> 
    <p>${el._id} : ${el.count}</p>
    </div>
    `;
    return str;
}


const fillContainer = async ()=>{
    let data = await fetch(`${baseServerUrl}/list`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    data = await data.json();
    let arr = data.map(eachAdminCard);
    container.innerHTML = arr.join('\n');
}

const eachAdminCard = (el)=>{
    let str = `
    <div class='col-12'> 
    <img src= ${el.icon}>
    <div>
    <h2>${el.name}</h2>
    <p>${el.email}</p>
    </div>
    </div>
    `
    return str;
}

const creatingChart = async ()=>{
    let data = await fetch(`${baseServerUrl}/traffic`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    data = await data.json();
    let keyArr = data.map((el)=> el._id);
    let valueArr = data.map((el)=>el.count);
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: keyArr,
            datasets: [{
                label: '# of hits',
                data: valueArr,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(153, 102, 255, 0.4)',
                    'rgba(255, 159, 64, 0.4)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
       
    });
}

logoutBtn.addEventListener('click', async ()=>{
    let result = await fetch(`${baseServerUrl}/logout`, {headers: {Authorization: `Bearer ${token}`}})
    if(result.ok){
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('icon');
        window.location.href = 'login.html';
    }else{
        alert('Something went wrong');
    }
})



      

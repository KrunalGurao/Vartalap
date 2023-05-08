const baseServerUrl = 'http://localhost:8998/admin'

const spanEl = document.querySelector('#welcomeMsg');
const logoutBtn = document.querySelector('#logoutFn');
const container = document.querySelector('#adminList');
const loading = document.querySelector('#loading');
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
    }
})


const display = async ()=>{
    let admin = await fetch(`${baseServerUrl}/adminInfo`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!admin.ok){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        localStorage.clear();
        setTimeout(()=>{
            window.location.href = 'login.html';
        }, 2500);
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


const fillContainer = async ()=>{
    let data = await fetch(`${baseServerUrl}/UserInfo`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    data = await data.json();
    let arr = data.map(eachAdminCard);
    container.innerHTML = arr.join('\n');
    let blockBtn = document.querySelectorAll('.blockBtn');
    blockBtn.forEach((el)=>{
        el.addEventListener('click', ()=>{
            let id = el.getAttribute('data-id')
            blockingStatus(id);
        })
    })
    let unblockBtn = document.querySelectorAll('.unblockBtn');
    unblockBtn.forEach((el)=>{
        el.addEventListener('click', ()=>{
            let id = el.getAttribute('data-id');
            unblockingStatus(id);
        })
    })
}

const blockingStatus = async(id)=>{
    let res = await fetch(`${baseServerUrl}/updatingStatus/${id}?isBlock=true`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(res.ok){
        fillContainer();
    }
}

const unblockingStatus = async(id)=>{
    let res = await fetch(`${baseServerUrl}/updatingStatus/${id}?isBlock=false`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(res.ok) fillContainer();
    else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
    }
}


const eachAdminCard = (el)=>{
    let str = `
    <div class='col-12'> 
    <img src= ${el.icon}>
    <div class='details'>
    <h2>${el.name}</h2>
    <p>${el.email}</p>
    </div>
    <div class='changeStatus'>
    ${checkingBlockStatus(el.isBlock, el._id)}
    </div>
    </div>
    `
    return str;
}


const checkingBlockStatus = (status, id)=>{
    let str;
    if(status===false){
        str = `
        <button type="button" class="blockBtn btn btn-outline-danger" data-id=${id}>Block</button>
        `;
    }else{
        str = `
        <button type="button" class="unblockBtn btn btn-outline-success" data-id=${id}>Unblock</button>
        `;
    }
    return str;
}



logoutBtn.addEventListener('click', async ()=>{
    let result = await fetch(`${baseServerUrl}/logout`, {headers: {Authorization: `Bearer ${token}`}})
    if(result.ok){
        Swal.fire('Logout Successful');
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('icon');
        setTimeout(()=>{
            window.location.href = 'login.html';
        }, 2500);
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
    }
})



      

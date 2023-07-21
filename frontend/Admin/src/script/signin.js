const baseServerUrl = 'https://chat-app-2pe3.onrender.com/admin'
// const baseServerUrl = 'http://localhost:8998/admin'

const formEl = document.querySelector('#formEl');
const nameEl = document.querySelector('#validationCustom01')
const emailEl = document.querySelector('#validationCustom02')
const passwordEl = document.querySelector('#validationCustom03')
const googleBtn = document.querySelector('#oauthGoogle');


(()=>{
    try{
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const acctoken = queryString.split('=')[1].split('%22')[1];
        localStorage.setItem('token', acctoken);
        console.log('after')
        window.location.href = 'index.html'
    }catch(err){
        console.log(err);
    }
})();


formEl.addEventListener('submit', (evnt) => {
    evnt.preventDefault();
    let obj = {};
    obj.email = emailEl.value;
    obj.password = passwordEl.value;
    signin(obj);
})

googleBtn.addEventListener('click', async ()=>{
    window.location.href = `${baseServerUrl}/auth/google`
})

const signin = async (obj) => {
    let res = await fetch(`${baseServerUrl}/login`, {
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': "application/json"
        },
        method: 'POST'
    })
    if (res.ok) {
        Swal.fire('Login Successful')
        res = await res.json();
        localStorage.setItem('token', res.access_token);
        setTimeout(()=>{
            window.location.href = `./index.html`
        }, 1500)
    }
}
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()
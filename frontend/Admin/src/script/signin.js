const baseServerUrl = 'https://vartalap-mpz9.onrender.com/admin'

const formEl = document.querySelector('#formEl');
const nameEl = document.querySelector('#validationCustom01')
const emailEl = document.querySelector('#validationCustom02')
const passwordEl = document.querySelector('#validationCustom03')
const googleBtn = document.querySelector('#oauthGoogle');

(()=>{
    try{
        const queryString = window.location.search;
        localStorage.setItem('token', queryString.split('=')[1].split('%22')[1]);
        window.location.href = 'index.html';
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
    window.location.href = 'https://vartalap-mpz9.onrender.com/admin/auth/google'
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
    }else{
        res = await res.json();
        console.log(res);
        alert('Something went wrong');
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
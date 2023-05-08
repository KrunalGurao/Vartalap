const baseServerUrl = 'http://localhost:8998/admin'

const formEl = document.querySelector('#formEl');
const nameEl = document.querySelector('#validationCustom01')
const emailEl = document.querySelector('#validationCustom02')
const passwordEl = document.querySelector('#validationCustom03')
const googleBtn = document.querySelector('#oauthGoogle');

formEl.addEventListener('submit', (evnt) => {
    evnt.preventDefault();
    let obj = {};
    obj.email = emailEl.value;
    obj.password = passwordEl.value;
    signin(obj);
})

googleBtn.addEventListener('click', async ()=>{
    window.location.href = 'http://localhost:8998/admin/auth/google'
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
        setTimeout(()=>{
            window.location.href = `http://127.0.0.1:5500?${JSON.stringify(res.access_token)}`
        }, 2500)
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
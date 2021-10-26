// import
import { url } from './config.js';
import { retrieveJWTtoken, setWithExpiry } from './token.js';

//partie connexion
const loginForm = document.forms.login;
loginForm.addEventListener("submit",connexion);

init();

//----------------------------- FONCTIONS ---------------------------
function init() {
    const resultat = retrieveJWTtoken();
    console.log(resultat);
    if (resultat.status === "authenticated") {
        Swal.fire({ // voir https://sweetalert2.github.io/
            text: 'Connexion réussie',
            icon: 'success',
            timer: 2000,
            confirmButtonText: 'OK'
        }).then((result) => {            
            if (result.isConfirmed) {
                window.location.href = './navigation/accueil.html';
            }
        });
    };
}

function connexion(eventconnect){
    eventconnect.preventDefault();
    const loginemail = loginForm.loginemail.value;
    const loginpassword = loginForm.loginpassword.value;    
    //console.log(loginEmail,loginPassword);

    //http://localhost:8082/auth/local
    const payload = { //on envoie ces infos
        identifier: loginemail,  // ! \\
        password: loginpassword
     };

    fetch(`${url}/auth/local`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((data) => {  
        //localStorage.setItem("user",JSON.stringify(data));// on stock le token et le user
        setWithExpiry("user", JSON.stringify(data), 1800000) //30mn (en ms)
        init();
    }).catch(err => {
        console.error(err);
    });
    /*console.log(localStorage);
    if (localStorage.length == 0) {       
        Swal.fire({
            text: 'message',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user"); 
            }
        });
    }*/
}

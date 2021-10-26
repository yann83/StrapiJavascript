import { url } from './config.js';
import { retrieveJWTtoken } from './token.js';

//partie enregistrement
const username = document.getElementById('username');;
const email = document.getElementById('email');;
const password = document.getElementById('password');;

const registerForm = document.forms.register;
registerForm.addEventListener('submit',register);

init();

//----------------------------- FONCTIONS ---------------------------
function init() {
    const resultat = retrieveJWTtoken();
    //console.log(resultat);
    if (resultat.status === "authenticated") {
        Swal.fire({ // voir https://sweetalert2.github.io/
            text: 'Enregistrement réussie',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user"); // on supprime le jeton pour obliger l'utilisateur à s'authentifier
                window.location.href = '../index.html';
            }
        });
    };
}

function register(eventregister) {
    eventregister.preventDefault();
    console.log('check here ',username,email,password);
    if (
      ValidateUsername(username) &&
      ValidateEmail(email) &&
      ValidatePassword(password,username)
    ) {
        //http://localhost:8082/auth/local/register
        const payload = { //on envoie ces infos
            username: username.value,
            email: email.value,
            password: password.value
        };

        fetch(`${url}/auth/local/register`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then((response) => response.json())
        .then((data) => { 
            localStorage.setItem("user",JSON.stringify(data));// on stock le token et le user
            init();
        })
        .catch(err => {
            console.error(err);
        })
    }
}

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail.value)) {
    return true;
  }
  alert("Cette adresse mail est invalide")
  return false;
}

function ValidateUsername(user) {
    if(user.value == '') {
        alert("Le nom d'utilisateur est vide");
        return false;
      }
    re = /^\w+$/;
    if(!re.test(user.value)) {
      alert("Le nom d'utilisateur doit contenir seulement des lettres, nombres et underscores");
      return false;
    }
    return true;
}

function ValidatePassword(pass,user) {
  re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if(!pass.value.match(re)) {
    alert("Le mot de passe doit contenir 8 caractéres, au moins 1 nombre, 1 majuscule et un caractére spécial.");
    return false;
  }
  if(pass.value == user.value) {
    alert("Le mot de passe doit être different du nom d'utilisateur");
    return false;
  } 
  return true;
}


import { url } from './config.js';
import { retrieveJWTtoken, getWithExpiry } from './token.js';

//partie changepassword
const useroptionsForm = document.forms.useroptions;
useroptionsForm.addEventListener('submit',changepassword);

init()

//----------------------------- FONCTIONS ---------------------------
function init() {    
    const resultat = retrieveJWTtoken();
    //console.log(resultat);
    if (resultat.status === "anonymous") {
        window.location.href = '../index.html';
    };
    afficheProfile();     
}

function deconnexion() {
    localStorage.removeItem("user");    
    init();
}

/*
{id: 1, username: 'user', email: 'user@user.fr', provider: 'local', confirmed: true, …}
blocked: null
confirmed: false
created_at: "2021-09-02T15:51:22.903Z"
email: "user@user.fr"
id: 1
*/
function afficheProfile() {
    //const token = JSON.parse(localStorage.getItem("user")).jwt; //voir fonction connexion
    const getuser = getWithExpiry("user");
    const token = JSON.parse(getuser).jwt; //voir fonction connexion
    fetch(`${url}/users/me`,{
        headers: {
            "Authorization": `Bearer ${token}`,
        },    
    })
    .then((response) => response.json())
    .then(data => {
        console.log(data);
        const usertext = document.getElementById("usertext");
        if (usertext) {
            usertext.textContent=data.username;
        };
        //console.log(isAdmin);
    })
}

function changepassword(eventregister) {
    eventregister.preventDefault();
    const getuser = getWithExpiry("user");
    const token = JSON.parse(getuser).jwt; //voir fonction connexion
    const identifier = useroptionsForm.username.value;
    const password = useroptionsForm.passwordold.value;
    const newPassword = useroptionsForm.passwordone.value;
    const confirmPassword = useroptionsForm.passwordtwo.value;
    console.log(identifier,password,newPassword,confirmPassword);
   
    //http://localhost:8082/users/updateMe
    const payload = { //on envoie ces infos
        identifier,
        password,
        newPassword,
        confirmPassword
    };

    fetch(`${url}/password`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`            
        },
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((data) => { 
      console.log(data);//retourne le nouverau jeton JWT
      deconnexion();
    })
    .catch(err => {
        console.error(err);
    })
}
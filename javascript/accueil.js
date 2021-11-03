import { url , collection} from './config.js';
import { retrieveJWTtoken, getWithExpiry } from './token.js';

//on cache ce formulaire en JavaScript.
const formcrud = document.getElementById("formcrud");
formcrud.style.display = "none";
const displaytable = document.getElementById("displaytable");

//creation liste des ads
let annoncesList = [];
let annoncesSearch = [];

init()

/*
on ajoute un eventListener lors de la saisie de texte dans ce champs de recherche.
*/
document
  .querySelectorAll("input[type=search]")[0]
  .addEventListener("input", recherche);

formcrud.addEventListener("submit",envoiDatas);

//upload image
const fileupload = formcrud.picture;
fileupload.addEventListener("change", getImage);
let fileImage = null;


//On ajoute un eventListerner au clic sur le bouton d'ajout.
document.getElementById("form-add").addEventListener("click", function() {
    displayForm();
});

document.getElementById("form-cancel").addEventListener("click", function() {
    hideForm();
});

//----------------------------- FONCTIONS ---------------------------
function init() {    
    const resultat = retrieveJWTtoken();
    //console.log(resultat);
    if (resultat.status === "anonymous") {
        window.location.href = '../index.html';
    };
    afficheProfile(); 
    getAnnonces(); 
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
        //console.log(data);
        const usertext = document.getElementById("usertext");
        if (usertext) {
            usertext.textContent=data.username;
        };
        //console.log(isAdmin);
    })
}

function getAnnonces() {
    const getuser = getWithExpiry("user");
    const token = JSON.parse(getuser).jwt;
    fetch(`${url}/${collection}`,{
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) /* on recupere l'objet sous form json */
    .then(result => {   
        console.log('getAnnonces',result);
        annoncesSearch = result;
        renderAnnonces(result);
    })
    .catch(err => {console.error(err);}
    )
}

function renderAnnonces(elements) {
    // Récupération de l'élement
    const tbodyDisplay = document.getElementsByTagName("tbody")[0];
    tbodyDisplay.innerHTML = "";
    let renderPicture = "";

    annoncesList = []; // on reinitialise pour la fonction recherche
    elements.forEach(element => {
        if (element.picture == null) { 
            renderPicture = '../img/default.jpg';
        } else {
            renderPicture = url + element.picture.formats.thumbnail.url;
        }
        const addItem =`
                        <tr>
                            <td>${element.title}</td>
                            <td>${element.category}</td>
                            <td>${element.content}</td>                            
                            <td><img src="${renderPicture}" alt="${element.title}"/></td>
                            <td>
                            <button class="edit btn btn-sm btn-outline-success" value="${element.id}">Modifier</button>
                            <button class="delete btn btn-sm btn-outline-danger" value="${element.id}">Supprimer</button>
                            </td>
                        </tr>
                        `;
        annoncesList = [...annoncesList,addItem];
    });
    if (annoncesList.length > 0) {
         tbodyDisplay.innerHTML = annoncesList.join("");

        // Chaque bouton "Supprimer"
        document.querySelectorAll("button.delete").forEach(b => {
            b.addEventListener("click", function() {
            console.log("test",this.value);
            return deleteRow(this.value);
            });
        });
    
        // on ajoute un eventListerner sur chaque bouton de modification.
        document.querySelectorAll("button.edit").forEach(b => {
            b.addEventListener("click", function() {
            return editRow(this.value);
            });
        });

    } else {
        // Aucune donnée
        tbodyDisplay.innerHTML += "<p>Aucune ligne trouvée</p>";
    }         
}

/*

Dernier a faire puis test sur auteur et role admin vs pas admin

*/
//Puis on créé une nouvelle fonction editMovie avec en paramètre l'index de la ligne.
function editRow(index) {
    const getuser = getWithExpiry("user");
    const token = JSON.parse(getuser).jwt; //voir fonction connexion
    
    fetch(`${url}/${collection}/${index}`,{
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) /* on recupere l'objet sous form json */
    .then(result => {   
        console.log('get',result);
        document.getElementById("title").value = result.title;
        document.getElementById("category").value = result.category;
        document.getElementById("content").value = result.content; 
        document.getElementById("pictureload").src = url.concat(result.picture.formats.thumbnail.url);      
    })
    .catch(err => {console.error(err);}
    )
    localStorage.setItem("edit",index);   
    displayForm();  

    /* event listener submit  */
}
  
function deleteRow(index) {
    const getuser = getWithExpiry("user");
    const token = JSON.parse(getuser).jwt; //voir fonction connexion
    if (confirm("Confirmez-vous la suppression de cette ligne ?")) {
        fetch(`${url}/${collection}/${index}`,{
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json()) /* on recupere l'objet sous form json */
        .then(result => {   
            console.log('getAnnonces',result);
            init();
        })
        .catch(err => {console.error(err);}
        )      
    }
}

/*
Pour trouver une ou plusieurs lignes, on utilise la fonction filter qui permet de rechercher des élements dans un tableau. De plus, on utilise la fonction toLowerCase pour initialiser le type de saisie de l'utilisateur. Jamais 2 sans 3, on utilise également la fonction includes qui permet de rechercher des caractères dans une chaine de caractères en retournant un booléen.
*/
function recherche() {
    const filteredData = annoncesSearch.filter(annonceSearch =>  // attention aux noms des variables
        annonceSearch.title.toLowerCase().includes(this.value.toLowerCase())
    );
    //console.log(filteredData);
    renderAnnonces(filteredData);
  }

function displayForm() {
    formcrud.style.display = "block";
    displaytable.style.display = "none";
}

function hideForm() {
    localStorage.removeItem("edit");// en cas d'edition si on cancel on supprime l'index en mémoire
    formcrud.style.display = "none";
    displaytable.style.display = "block";
}

function envoiDatas(submitevent) {
    submitevent.preventDefault(); //empeche de rafraichr la page
    const title = formcrud.title.value.trim();
    const category = formcrud.category.value;
    const content = formcrud.content.value; 
    const picture = fileImage;
    console.log(title,category,content,picture);

    const getuser = getWithExpiry("user");
    const token = JSON.parse(getuser).jwt; //voir fonction connexion

    //Uncaught TypeError: Assignment to constant variable car j'avais mis const au lieu de let
    let fetchstring = "";
    let methodstring = "";
    const idelement = localStorage.getItem("edit");
	if (!idelement) {// if the idelement doesn't exist, return null
		fetchstring = url+"/"+collection;
        methodstring = 'POST';
	} else {
		fetchstring = url+"/"+collection+"/"+idelement;
        methodstring = 'PUT';
    }

    const payload = { //on envoie ces infos sauf l'image
        title,
        content,
        category
    };

    fetch(fetchstring,{
        method: methodstring,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((envoiData) => { 
      console.log("upload part",envoiData);
      const formData = new FormData();
      formData.append("files",picture);
      /*cette image sera associé a un objet de cette collection classifiedad
      sans le s voir strapi -> plugins -> Content-Types Builder*/
      formData.append("ref","annonce");
      formData.append("refId",envoiData.id);// quel est l'id
      formData.append("field","picture");//quel est le champ
      console.log("formData",formData);
      //envoi de l'image avec l'id précedent
      fetch(`${url}/upload`,{ // attention il faut autoriser l'upload pour les utilisateurs authentifiés
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
      })
      .then((response) => {
          console.log("res image upload",response);
          hideForm();
          init();
      })
    })
    .catch(err => {
        console.error(err);
    })
}

function getImage() {
    console.log("images", this.files[0]);
    fileImage = this.files[0];
}
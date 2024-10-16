const baseUrl = 'https://geo.api.gouv.fr';
const regtList = document.querySelector('#region-list');
const departList = document.querySelector('#depart-list');
const comList = document.querySelector('#commune-list');
const btnShow = document.querySelector('#showCommunes');

let codeDepart;


// Liste de tous les départements de France
fetch(`${baseUrl}/regions`)
    .then(response => response.json())
    .then(data => {
        regtList.innerHTML = data.map(region => {
            // console.log(region);
            return `<option value="${region.code}">${region.nom}</option>`;
        }).join('');
    })
    // Ajout d'une gestion d'erreur
    .catch(error => console.error('Erreur:', error));  


// Récuperer la valeur du département au click 
regtList.addEventListener('change', (e) => {
    const selectedReg = e.target.value;
    // console.log(selectedReg);
    callDepart(selectedReg);

});

// Function to call api to get departement
async function callDepart(code) {
    codeDepart  = '';
    fetch(`${baseUrl}/regions/${code}/departements`)
    .then(response => response.json())
    .then(data => {
        departList.innerHTML = data.map(departement => {
            console.log(departement.code);
            codeDepart = departement.code;
            return `<option value="${departement.code}">${departement.nom}</option>`;
        }).join('');
    })
    // Ajout d'une gestion d'erreur
    .catch(error => console.error('Erreur:', error)); 
}

//Function to call api to get communes
btnShow.addEventListener('click', () => {
    const selectedDepart = departList.value;  
    
    if (selectedDepart) {
        fetch(`${baseUrl}/departements/${selectedDepart}/communes`)
            .then(response => response.json())
            .then(data => {
                comList.innerHTML = data.map(commune => {
                    console.log(commune);
                    return `<li>${commune.nom} (${commune.population})</li>`;
                }).join('');
            })
            .catch(error => console.error('Erreur:', error));
    } else {
        console.log('Aucun département sélectionné.');
    }
})

const baseUrl = 'https://geo.api.gouv.fr';
const regtList = document.querySelector('#region-list');
const departList = document.querySelector('#depart-list');

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
    console.log(selectedReg);
    callDepart(selectedReg);

})

async function callDepart(code) {
    fetch(`${baseUrl}/regions/${code}/departements`)
    .then(response => response.json())
    .then(data => {
        departList.innerHTML = data.map(departement => {
            // console.log(region);
            return `<option value="${departement.code}">${departement.nom}</option>`;
        }).join('');
    })
    // Ajout d'une gestion d'erreur
    .catch(error => console.error('Erreur:', error)); 
}
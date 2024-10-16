const baseUrlDepart = 'https://geo.api.gouv.fr';
const departList = document.querySelector('#depart-list');

// Liste de tous les départements de France
fetch(`${baseUrlDepart}/departements`)
    .then(response => response.json())  // Correction ici, 'response' au lieu de 'reponse'
    .then(data => {
        departList.innerHTML = data.map(departement => {
            console.log(departement)
            return `<option value="${departement.nom}">${departement.nom}</option>`;
        }).join('');
    })
    .catch(error => console.error('Erreur:', error));  // Ajout d'une gestion d'erreur

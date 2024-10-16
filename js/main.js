const baseUrl = 'https://geo.api.gouv.fr';
const regtList = document.querySelector('#region-list');
const departList = document.querySelector('#depart-list');
const comList = document.querySelector('#commune-list');
const btnShow = document.querySelector('#showCommunes');
const divGeoMess = document.querySelector('#message-geo');
const btnGeo = document.querySelector('#get-geoloca');

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


///EX 2 Géolocalisation 
btnGeo.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        fetch(nominatimUrl)
            .then(response => response.json())
            .then(data => {
                const address = data.display_name;
                divGeoMess.innerHTML = `<p>Je suis à l'adresse suivante : ${address}</p>`;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'adresse :', error);
                divGeoMess.innerHTML = `<p>Impossible de récupérer l'adresse.</p>`;
            });

    }, error => {
        console.error(`An error occurred: ${error.message}`);
        divGeoMess.innerHTML = `<p>Erreur de géolocalisation : ${error.message}</p>`;
    });
});
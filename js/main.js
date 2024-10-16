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


///EX 2 Géolocalisation 
const divGeoMess = document.querySelector('#message-geo');
const btnGeo = document.querySelector('#get-geoloca');

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

// Ex3 Cinéma

const btnCine = document.querySelector("#get-cinema");
const cineList = document.querySelector("#cine-list");
const baseUrlCine = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques';



btnCine.addEventListener('click', () => {
    fetch(`${baseUrlCine}`)
        .then(response => response.json())
        .then(data => {
            //Trier les cinéma
            const sortedCinemas = data.records.sort((a, b) => {
                const fauteuilsA = a.fields.fauteuils || 0;  // Nombre de fauteuils du cinéma A
                const fauteuilsB = b.fields.fauteuils || 0;  // Nombre de fauteuils du cinéma B
                return fauteuilsB - fauteuilsA;  // Trier par ordre décroissant
            });

            cineList.innerHTML = sortedCinemas.map(cinema => {
                console.log(cinema.fields);
                const cinemaNom = cinema.fields.nom || 'Nom inconnu';
                const adresse = cinema.fields.adresse || 'Adresse inconnu';
                const ville = cinema.fields.unite_urbaine || 'Ville inconnu';
                const fauteuils = cinema.fields.fauteuils || 'Fauteuils inconnu';
                
                return `<li> Nom :  ${cinemaNom} ; Adresse : ${adresse} ; Ville : ${ville} ; Fauteuils : ${fauteuils}</li>`;
            }).join('');
        })
        .catch(error => {
            console.error('Erreur:', error);
            cineList.innerHTML = `<p>Erreur lors de la récupération des cinémas.</p>`;
        });
});
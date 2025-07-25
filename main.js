document.addEventListener('DOMContentLoaded', () => {
  // Affichage du champ "Préciser le type"
  const selectType = document.getElementById('typeClient');
  const autreTypeContainer = document.getElementById('autreTypeContainer');
  selectType.addEventListener('change', () => {
    autreTypeContainer.style.display = selectType.value === 'autre' ? 'block' : 'none';
  });

  // Affichage de la section "Partie représentée"
  const selectQualite = document.getElementById('qualite');
  const partieContainer = document.getElementById('partieRepresenteeContainer');
  selectQualite.addEventListener('change', () => {
    if (selectQualite.value === 'Partie représentée') {
      partieContainer.style.display = 'block';
    } else {
      partieContainer.style.display = 'none';
      document.querySelector('#partieRepresenteeTable tbody').innerHTML = '';
    }
  });

  // === Client ===
  const clientForm = document.getElementById('client-form');
  const clientTableBody = document.querySelector('#client-table tbody');
  clientForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const idClient = f.idClient.value;
    const typeClient = f.typeClient.value === 'autre' ? f.typeClientAutre.value : f.typeClient.value;
    const nom = f.nom.value;
    const ident = f.identifiant.value;
    const adresse = f.adresse.value;
    const mobile = f.mobile_country.value + ' ' + f.mobile.value;
    const fixe = f.fixe_country.value + ' ' + f.fixe.value;
    const fax = f.fax.value;
    const email = f.email.value;
    const qualite = f.qualite.value;

    // Affiche le tableau s'il est caché
    document.getElementById('client-table').style.display = 'table';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${idClient}</td>
      <td>${typeClient}</td>
      <td>${nom}</td>
      <td>${ident}</td>
      <td>${adresse}</td>
      <td>${mobile}</td>
      <td>${fixe}</td>
      <td>${fax}</td>
      <td>${email}</td>
      <td>${qualite}</td>
      <td><button type="button" class="deleteRow">Supprimer</button></td>
    `;
    row.querySelector('.deleteRow').addEventListener('click', () => row.remove());
    clientTableBody.appendChild(row);
    f.reset();
  });

  // === Terrain ===
  const terrainForm = document.getElementById('terrain-form');
  const terrainTableBody = document.querySelector('#terrain-table tbody');
  terrainForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const region = f.region.value;
    const province = f.province.value;
    const commune = f.commune.value;
    const ville = f.ville.value;
    const barX = f.baricentreX.value;
    const barY = f.baricentreY.value;
    const superficie = f.superficie.value;
    const statut = f.statutFoncier.value;
    const coutM2 = f.coutM2.value;

    document.getElementById('terrain-table').style.display = 'table';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${region}</td>
      <td>${province}</td>
      <td>${commune}</td>
      <td>${ville}</td>
      <td>${barX}, ${barY}</td>
      <td>${superficie} m²</td>
      <td>${statut}</td>
      <td>${coutM2} DH</td>
      <td><button type="button" class="deleteRow">Supprimer</button></td>
    `;
    row.querySelector('.deleteRow').addEventListener('click', () => row.remove());
    terrainTableBody.appendChild(row);
    f.reset();
  });

  // === Coordonnées dynamiques ===
  let coordCount = 0;
  const coordsList = document.getElementById('coordsList');
  document.getElementById('addCoordButton').addEventListener('click', () => {
    coordCount++;
    const wrapper = document.createElement('div');
    wrapper.className = 'coord-pair';
    wrapper.innerHTML = `
      <label>P${coordCount} X :
        <input type="number" step="any" name="coordX[]" placeholder="Longitude" required />
      </label>
      <label>P${coordCount} Y :
        <input type="number" step="any" name="coordY[]" placeholder="Latitude" required />
      </label>
      <button type="button" class="removeCoord">Supprimer</button>
    `;
    wrapper.querySelector('.removeCoord').addEventListener('click', () => wrapper.remove());
    coordsList.appendChild(wrapper);
  });

  // === Missions dynamiques ===
  let missionCount = 0;
  const missionsList = document.getElementById('missionsList');
  document.getElementById('addMissionButton').addEventListener('click', () => {
    missionCount++;
    const entry = document.createElement('div');
    entry.className = 'mission-entry';
    entry.innerHTML = `
      <label>Mission ${missionCount} - Numéro :
        <input type="text" name="missionNum[]" required placeholder="Ex : M-${missionCount}" />
      </label>
      <label>Date :
        <input type="date" name="missionDate[]" required />
      </label>
      <label>Intervenant :
        <input type="text" name="missionIntervenant[]" required placeholder="Nom…" />
      </label>
      <label>Résultat :
        <input type="text" name="missionResultat[]" placeholder="Résultat…" />
      </label>
      <button type="button" class="removeMission">Supprimer mission</button>
    `;
    entry.querySelector('.removeMission').addEventListener('click', () => entry.remove());
    missionsList.appendChild(entry);
  });

// === Contrat (ajout + suppression avec lien PDF) ===
const contratForm      = document.getElementById('contrat-form');
const contratTableBody = document.querySelector('#contrat-table tbody');

contratForm.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;

  // Récupération des fichiers
  const sigFile  = f.signatureContrat.files[0];
  const visaFile = f.visaContrat.files[0];

  // Création d’URL pour pouvoir télécharger / prévisualiser
  const sigURL  = sigFile  ? URL.createObjectURL(sigFile)  : '';
  const visaURL = visaFile ? URL.createObjectURL(visaFile) : '';

  // Autres champs
  const depot = f.depotPlateforme.value;
  const avis  = Array.from(
    f.querySelectorAll('input[name="avis[]"]:checked')
  ).map(cb => cb.nextSibling.textContent.trim())
   .join(', ');

  // Affiche le tableau s’il était masqué
  document.getElementById('contrat-table').style.display = 'table';

  // Création de la ligne
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      ${ sigURL
         ? `<a href="${sigURL}" download="${sigFile.name}">${sigFile.name}</a>`
         : ''
      }
    </td>
    <td>
      ${ visaURL
         ? `<a href="${visaURL}" download="${visaFile.name}">${visaFile.name}</a>`
         : ''
      }
    </td>
    <td>${depot}</td>
    <td>${avis}</td>
    <td><button type="button" class="deleteRow">Supprimer</button></td>
  `;

  // Supprime l’URL blob quand on retire la ligne (libère la mémoire)
  row.querySelector('.deleteRow').addEventListener('click', () => {
    row.remove();
    if (sigURL)  URL.revokeObjectURL(sigURL);
    if (visaURL) URL.revokeObjectURL(visaURL);
  });

  contratTableBody.appendChild(row);
  f.reset();
});


});

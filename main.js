document.addEventListener('DOMContentLoaded', () => {

  // === Client ===
  const selectType = document.getElementById('typeClient');
  const autreTypeContainer = document.getElementById('autreTypeContainer');
  selectType.addEventListener('change', () => {
    autreTypeContainer.style.display = selectType.value === 'autre' ? 'block' : 'none';
  });

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

  const clientForm = document.getElementById('client-form');
  const clientTableBody = document.querySelector('#client-table tbody');
  clientForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const vals = {
      idClient: f.idClient.value,
      typeClient: f.typeClient.value === 'autre' ? f.typeClientAutre.value : f.typeClient.value,
      nom: f.nom.value,
      ident: f.identifiant.value,
      adresse: f.adresse.value,
      mobile: f.mobile_country.value + ' ' + f.mobile.value,
      fixe: f.fixe_country.value + ' ' + f.fixe.value,
      fax: f.fax.value,
      email: f.email.value,
      qualite: f.qualite.value
    };
    document.getElementById('client-table').style.display = 'table';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${vals.idClient}</td><td>${vals.typeClient}</td><td>${vals.nom}</td>
      <td>${vals.ident}</td><td>${vals.adresse}</td><td>${vals.mobile}</td>
      <td>${vals.fixe}</td><td>${vals.fax}</td><td>${vals.email}</td>
      <td>${vals.qualite}</td>
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
    const vals = {
      region: f.region.value,
      province: f.province.value,
      commune: f.commune.value,
      ville: f.ville.value,
      bary: `${f.baricentreX.value}, ${f.baricentreY.value}`,
      sup: f.superficie.value + ' m²',
      statut: f.statutFoncier.value,
      cout: f.coutM2.value + ' DH'
    };
    document.getElementById('terrain-table').style.display = 'table';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${vals.region}</td><td>${vals.province}</td><td>${vals.commune}</td>
      <td>${vals.ville}</td><td>${vals.bary}</td><td>${vals.sup}</td>
      <td>${vals.statut}</td><td>${vals.cout}</td>
      <td><button type="button" class="deleteRow">Supprimer</button></td>
    `;
    row.querySelector('.deleteRow').addEventListener('click', () => row.remove());
    terrainTableBody.appendChild(row);
    f.reset();
  });

  // Coordonnées dynamiques
  let coordCount = 0;
  const coordsList = document.getElementById('coordsList');
  document.getElementById('addCoordButton').addEventListener('click', () => {
    coordCount++;
    const w = document.createElement('div');
    w.className = 'coord-pair';
    w.innerHTML = `
      <label>P${coordCount} X :<input type="number" step="any" name="coordX[]" required /></label>
      <label>P${coordCount} Y :<input type="number" step="any" name="coordY[]" required /></label>
      <button type="button" class="removeCoord">Supprimer</button>
    `;
    w.querySelector('.removeCoord').addEventListener('click', () => w.remove());
    coordsList.appendChild(w);
  });

  // Missions dynamiques
  let missionCount = 0;
  const missionsList = document.getElementById('missionsList');
  document.getElementById('addMissionButton').addEventListener('click', () => {
    missionCount++;
    const e = document.createElement('div');
    e.className = 'mission-entry';
    e.innerHTML = `
      <label>Mission ${missionCount} - Numéro :<input type="text" name="missionNum[]" required /></label>
      <label>Date :<input type="date" name="missionDate[]" required /></label>
      <label>Intervenant :<input type="text" name="missionIntervenant[]" required /></label>
      <label>Résultat :<input type="text" name="missionResultat[]" /></label>
      <button type="button" class="removeMission">Supprimer mission</button>
    `;
    e.querySelector('.removeMission').addEventListener('click', () => e.remove());
    missionsList.appendChild(e);
  });

  // === Contrat ===
  const contratForm = document.getElementById('contrat-form');
  const contratTableBody = document.querySelector('#contrat-table tbody');
  contratForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const sig = f.signatureContrat.files[0];
    const vis = f.visaContrat.files[0];
    const sigURL = sig ? URL.createObjectURL(sig) : '';
    const visURL = vis ? URL.createObjectURL(vis) : '';
    const depot = f.depotPlateforme.value;
    const avis = Array.from(f.querySelectorAll('input[name="avis[]"]:checked'))
                  .map(cb => cb.nextSibling.textContent.trim())
                  .join(', ');
    document.getElementById('contrat-table').style.display = 'table';
    const r = document.createElement('tr');
    r.innerHTML = `
      <td>${ sigURL ? `<a href="${sigURL}" download="${sig.name}">${sig.name}</a>` : '' }</td>
      <td>${ visURL ? `<a href="${visURL}" download="${vis.name}">${vis.name}</a>` : '' }</td>
      <td>${depot}</td><td>${avis}</td>
      <td><button type="button" class="deleteRow">Supprimer</button></td>
    `;
    r.querySelector('.deleteRow').addEventListener('click', () => {
      r.remove();
      if(sigURL) URL.revokeObjectURL(sigURL);
      if(visURL) URL.revokeObjectURL(visURL);
    });
    contratTableBody.appendChild(r);
    f.reset();
  });

  // === Facture ===
  const factureForm = document.getElementById('facture-form');
  const factureTableBody = document.querySelector('#facture-table tbody');
  factureForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const d = new FormData(f);
    const vals = [
      d.get('num_fact'),
      d.get('date_fact'),
      d.get('num_contrat'),
      d.get('date_contrat'),
      d.get('client'),
      d.get('cin_rc_ice'),
      d.get('qualite_facture'),
      d.get('adresse_facture'),
      d.get('projet_facture'),
      d.get('adresse_projet'),
      d.get('commune_facture'),
      d.get('num_autorisation'),
      d.get('date_autorisation'),
      d.get('date_achevement_prest'),
      d.get('id_missions'),
      d.get('missions_accomplies'),
      d.get('montant_ht'),
      d.get('montant_tva'),
      d.get('montant_ttc'),
      d.get('date_reg'),
      d.get('mode_reg'),
      d.get('ref_oper'),
      d.get('observation')
    ];
    document.getElementById('facture-table').style.display = 'table';
    const tr = document.createElement('tr');
    tr.innerHTML = vals.map(v => `<td>${v}</td>`).join('') +
      `<td><button type="button" class="delete-btn">Supprimer</button></td>`;
    tr.querySelector('.delete-btn').addEventListener('click', () => tr.remove());
    factureTableBody.appendChild(tr);
    f.reset();
  });

  // Suppression facture
  document.querySelector('#facture-table tbody').addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
      e.target.closest('tr').remove();
    }
  });

  // === Générer PDF facture ===
  document.getElementById('generate-pdf').addEventListener('click', () => {
    const element = document.getElementById('facture-form');
    const opt = {
      margin: 0.4,
      filename: `Facture-${document.querySelector('[name="num_fact"]').value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  });

});

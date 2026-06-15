let linguaCorrente = 'it';

const traduzioni = {
    it: {
        title: "Registro Produzione & Allergeni",
        subtitle: "Gestione totale di Gusti, Basi e Allergeni del laboratorio.",
        filterLabel: "Filtra per allergene:",
        thGusto: "Gusto Gelato",
        thBase: "Tipo/Base",
        thAllergeni: "Allergeni Presenti",
        thAzioni: "Azioni",
        all: "Mostra tutti i gusti",
        safe: "✓ Senza allergeni",
        manageGustiTitle: "1. Configura Gusto",
        manageBasiTitle: "2. Gestione Basi",
        manageAllergeniTitle: "3. Gestione Allergeni",
        lblNomeGusto: "Nome Gusto:",
        lblBaseGusto: "Seleziona Base:",
        lblAllergeniGusto: "Seleziona Allergeni:",
        btnSalva: "Salva",
        btnAnnulla: "Annulla"
    },
    en: {
        title: "Production & Allergen Registry",
        subtitle: "Total management of Flavors, Bases, and Allergens.",
        filterLabel: "Filter by allergen:",
        thGusto: "Gelato Flavor",
        thBase: "Type/Base",
        thAllergeni: "Allergens Present",
        thAzioni: "Actions",
        all: "Show all flavors",
        safe: "✓ Allergen free",
        manageGustiTitle: "1. Configure Flavor",
        manageBasiTitle: "2. Manage Bases",
        manageAllergeniTitle: "3. Manage Allergens",
        lblNomeGusto: "Flavor Name:",
        lblBaseGusto: "Select Base:",
        lblAllergeniGusto: "Select Allergens:",
        btnSalva: "Save",
        btnAnnulla: "Cancel"
    },
    de: {
        title: "Produktions- & Allergenregister",
        subtitle: "Vollständige Verwaltung von Sorten, Basen und Allergenen.",
        filterLabel: "Nach Allergen filtern:",
        thGusto: "Eissorte",
        thBase: "Typ/Basis",
        thAllergeni: "Enthaltene Allergene",
        thAzioni: "Aktionen",
        all: "Alle Sorten anzeigen",
        safe: "✓ Allergenfrei",
        manageGustiTitle: "1. Sorte konfigurieren",
        manageBasiTitle: "2. Basen verwalten",
        manageAllergeniTitle: "3. Allergene verwalten",
        lblNomeGusto: "Sortenname:",
        lblBaseGusto: "Basis wählen:",
        lblAllergeniGusto: "Allergene wählen:",
        btnSalva: "Speichern",
        btnAnnulla: "Abbrechen"
    },
    fr: {
        title: "Registre de Production & Allergènes",
        subtitle: "Gestion totale des Parfums, Bases et Allergènes.",
        filterLabel: "Filtrer par allergène :",
        thGusto: "Parfum de Glace",
        thBase: "Type/Base",
        thAllergeni: "Allergènes Présents",
        thAzioni: "Actions",
        all: "Afficher tous les parfums",
        safe: "✓ Sans allergènes",
        manageGustiTitle: "1. Configurer le Parfum",
        manageBasiTitle: "2. Gérer les Bases",
        manageAllergeniTitle: "3. Gérer les Allergènes",
        lblNomeGusto: "Nom du Parfum :",
        lblBaseGusto: "Choisir la Base :",
        lblAllergeniGusto: "Choisir les Allergènes :",
        btnSalva: "Enregistrer",
        btnAnnulla: "Annuler"
    }
};

let basi = JSON.parse(localStorage.getItem("gelato_basi")) || [
    { id: "b1", nome: "Latte" },
    { id: "b2", nome: "Acqua" }
];

let allergeni = JSON.parse(localStorage.getItem("gelato_allergeni")) || [
    { id: "a1", nome: "Lattosio" },
    { id: "a2", nome: "Frutta a guscio" },
    { id: "a3", nome: "Glutine" }
];

let gusti = JSON.parse(localStorage.getItem("gelato_gusti")) || [
    { id: "g1", nome: "Fiordilatte", baseId: "b1", allergeniIds: ["a1"] },
    { id: "g2", nome: "Fragola", baseId: "b2", allergeniIds: [] }
];

function salvaNelStorage() {
    localStorage.setItem("gelato_basi", JSON.stringify(basi));
    localStorage.setItem("gelato_allergeni", JSON.stringify(allergeni));
    localStorage.setItem("gelato_gusti", JSON.stringify(gusti));
}

function rendering() {
    document.querySelectorAll("[data-key]").forEach(el => {
        const k = el.getAttribute("data-key");
        if (traduzioni[linguaCorrente][k]) el.innerText = traduzioni[linguaCorrente][k];
    });

    const filterSelect = document.getElementById("allergen-filter");
    const vecchioFiltro = filterSelect.value || "tutti";
    
    let opzioniFiltro = `<option value="tutti">${traduzioni[linguaCorrente].all}</option>`;
    allergeni.forEach(a => {
        opzioniFiltro += `<option value="${a.id}">${a.nome}</option>`;
    });
    filterSelect.innerHTML = opzioniFiltro;
    filterSelect.value = vecchioFiltro;

    const cbGroup = document.getElementById("gusto-allergeni-checkboxes");
    let htmlCheckbox = "";
    allergeni.forEach(a => {
        htmlCheckbox += `<label><input type="checkbox" value="${a.id}" class="gusto-cb"> ${a.nome}</label>`;
    });
    cbGroup.innerHTML = htmlCheckbox;

    const baseSelect = document.getElementById("gusto-base");
    let htmlBasiSelect = "";
    basi.forEach(b => {
        htmlBasiSelect += `<option value="${b.id}">${b.nome}</option>`;
    });
    baseSelect.innerHTML = htmlBasiSelect;

    mostraListaSemplice("basi-list", basi, "preparaModificaBase", "eliminaBase");
    mostraListaSemplice("allergeni-list", allergeni, "preparaModificaAllergene", "eliminaAllergene");

    filtraGusti();
}

function mostraListaSemplice(elementId, dataset, editFn, deleteFn) {
    const list = document.getElementById(elementId);
    if (!list) return;
    list.innerHTML = "";
    dataset.forEach(item => {
        list.innerHTML += `
            <li>
                <span>${item.nome}</span>
                <div class="list-actions">
                    <button type="button" class="btn-edit" onclick="${editFn}('${item.id}')">✏️</button>
                    <button type="button" class="btn-delete" onclick="${deleteFn}('${item.id}')">🗑️</button>
                </div>
            </li>
        `;
    });
}

function mostraGustiTabella(listaFiltrata) {
    const tbody = document.getElementById("products-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    listaFiltrata.forEach(g => {
        const riga = document.createElement("tr");
        
        const objBase = basi.find(b => b.id === g.baseId);
        const nomeBase = objBase ? objBase.nome : "N/D";

        const nomiAllergeni = g.allergeniIds
            .map(id => allergeni.find(a => a.id === id))
            .filter(a => a !== undefined)
            .map(a => a.nome);

        const allergeniTesto = nomiAllergeni.length > 0 
            ? `<span class="danger">${nomiAllergeni.join(", ")}</span>`
            : traduzioni[linguaCorrente].safe;

        riga.innerHTML = `
            <td><strong>${g.nome}</strong></td>
            <td>${nomeBase}</td>
            <td>${allergeniTesto}</td>
            <td>
                <button type="button" class="btn-edit" onclick="preparaModificaGusto('${g.id}')">✏️</button>
                <button type="button" class="btn-delete" onclick="eliminaGusto('${g.id}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(riga);
    });
}

function filtraGusti() {
    const filterSelect = document.getElementById("allergen-filter");
    if (!filterSelect) return;
    
    const f = filterSelect.value || "tutti";
    if (f === "tutti") {
        mostraGustiTabella(gusti);
    } else {
        const filtrati = gusti.filter(g => g.allergeniIds.includes(f));
        mostraGustiTabella(filtrati);
    }
}

function salvaGusto(e) {
    e.preventDefault();
    const id = document.getElementById("gusto-id").value;
    const nome = document.getElementById("gusto-nome").value;
    const baseId = document.getElementById("gusto-base").value;
    const allergeniIds = Array.from(document.querySelectorAll(".gusto-cb:checked")).map(cb => cb.value);

    if (id) {
        const idx = gusti.findIndex(g => g.id === id);
        if (idx !== -1) gusti[idx] = { id, nome, baseId, allergeniIds };
    } else {
        gusti.push({ id: "g_" + Date.now(), nome, baseId, allergeniIds });
    }
    
    salvaNelStorage();
    rendering();
    resetFormGusto();
}

function preparaModificaGusto(id) {
    const g = gusti.find(x => x.id === id);
    if (!g) return;
    document.getElementById("gusto-id").value = g.id;
    document.getElementById("gusto-nome").value = g.nome;
    document.getElementById("gusto-base").value = g.baseId;
    
    document.querySelectorAll(".gusto-cb").forEach(cb => {
        cb.checked = g.allergeniIds.includes(cb.value);
    });
    document.getElementById("btn-gusto-annulla").style.display = "inline-block";
}

function eliminaGusto(id) {
    if(confirm("Eliminare questo gusto?")) { 
        gusti = gusti.filter(g => g.id !== id); 
        salvaNelStorage();
        rendering();
    }
}

function resetFormGusto() {
    document.getElementById("gusto-form").reset();
    document.getElementById("gusto-id").value = "";
    document.getElementById("btn-gusto-annulla").style.display = "none";
}

function salvaBase(e) {
    e.preventDefault();
    const id = document.getElementById("base-id").value;
    const nome = document.getElementById("base-nome").value;

    if (id) {
        const idx = basi.findIndex(b => b.id === id);
        if (idx !== -1) basi[idx].nome = nome;
    } else {
        basi.push({ id: "b_" + Date.now(), nome });
    }
    salvaNelStorage(); rendering(); resetFormBase();
}

function preparaModificaBase(id) {
    const b = basi.find(x => x.id === id);
    if (!b) return;
    document.getElementById("base-id").value = b.id;
    document.getElementById("base-nome").value = b.nome;
    document.getElementById("btn-base-annulla").style.display = "inline-block";
}

function eliminaBase(id) {
    if(confirm("Eliminando questa base, i gusti associati rimarranno senza base. Procedere?")) {
        basi = basi.filter(b => b.id !== id);
        gusti.forEach(g => { if(g.baseId === id) g.baseId = ""; });
        salvaNelStorage(); rendering(); resetFormBase();
    }
}

function resetFormBase() {
    document.getElementById("base-form").reset();
    document.getElementById("base-id").value = "";
    document.getElementById("btn-base-annulla").style.display = "none";
}

function salvaAllergene(e) {
    e.preventDefault();
    const id = document.getElementById("allergen-id").value;
    const nome = document.getElementById("allergen-nome").value;

    if (id) {
        const idx = allergeni.findIndex(a => a.id === id);
        if (idx !== -1) allergeni[idx].nome = nome;
    } else {
        allergeni.push({ id: "a_" + Date.now(), nome });
    }
    salvaNelStorage(); rendering(); resetFormAllergene();
}

function preparaModificaAllergene(id) {
    const a = allergeni.find(x => x.id === id);
    if (!a) return;
    document.getElementById("allergen-id").value = a.id;
    document.getElementById("allergen-nome").value = a.nome;
    document.getElementById("btn-allergen-annulla").style.display = "inline-block";
}

function eliminaAllergene(id) {
    if(confirm("Rimuovere questo allergene da tutto il database?")) {
        allergeni = allergeni.filter(a => a.id !== id);
        gusti.forEach(g => g.allergeniIds = g.allergeniIds.filter(aid => aid !== id));
        salvaNelStorage(); rendering(); resetFormAllergene();
    }
}

function resetFormAllergene() {
    document.getElementById("allergen-form").reset();
    document.getElementById("allergen-id").value = "";
    document.getElementById("btn-allergen-annulla").style.display = "none";
}

function cambiaLingua(n) { linguaCorrente = n; rendering(); }

window.onload = () => { rendering(); };
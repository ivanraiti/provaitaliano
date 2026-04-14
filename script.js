// DATABASE UTENTI (Puoi aggiungerne altri seguendo lo schema)
const utentiAutorizzati = {
    "studente1": "scuola2026",
    "studente2": "pass02",
    "studente3": "pass03",
    "studente4": "pass04",
    "studente5": "pass05",
    "studente6": "pass06",
    "studente7": "pass07",
    "studente8": "pass08",
    "studente9": "pass09",
    "studente10": "pass10",
    "studente11": "pass11",
    "studente12": "pass12"
};

let domande = [];
let indiceAttuale = 0;
let risposteDate = [];

// CARICAMENTO DATI DAL JSON
fetch('domande.json')
    .then(res => res.json())
    .then(data => {
        domande = data;
        document.getElementById('testo-pieno').innerText = domande[0].brano;
    })
    .catch(err => console.error("Errore caricamento file JSON:", err));

// FUNZIONE LOGIN
function controllaLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    if (utentiAutorizzati[u] && utentiAutorizzati[u] === p) {
        document.getElementById('schermata-login').classList.add('hidden');
        document.getElementById('schermata-lettura').classList.remove('hidden');
    } else {
        alert("Username o Password non validi!");
    }
}

// FUNZIONE INIZIA QUIZ
function iniziaQuiz() {
    document.getElementById('schermata-lettura').classList.add('hidden');
    document.getElementById('schermata-quiz').classList.remove('hidden');
    mostraDomanda();
}

// MOSTRA DOMANDA (Mantiene il brano sempre visibile)
function mostraDomanda() {
    const d = domande[indiceAttuale];
    
    // Mostra il brano (se la domanda non lo ha, usa quello della prima domanda)
    document.getElementById('box-brano').innerText = d.brano || domande[0].brano;
    
    document.getElementById('numero-domanda').innerText = `Domanda ${indiceAttuale + 1} di ${domande.length}`;
    document.getElementById('testo-domanda').innerText = d.testo;

    const contenitore = document.getElementById('lista-opzioni');
    contenitore.innerHTML = '';

    d.opzioni.forEach((opt, i) => {
        contenitore.innerHTML += `
            <label class="opzione-item">
                <input type="radio" name="scelta" value="${i}">
                <span>${opt}</span>
            </label>
        `;
    });

    const ctrl = document.getElementById('controlli');
    if (indiceAttuale === domande.length - 1) {
        ctrl.innerHTML = `<button onclick="mostraRisultato()">FINE TEST</button>`;
    } else {
        ctrl.innerHTML = `<button onclick="prossima()">AVANTI »</button>`;
    }
}

function prossima() {
    salvaRisposta();
    indiceAttuale++;
    mostraDomanda();
}

function salvaRisposta() {
    const sel = document.querySelector('input[name="scelta"]:checked');
    risposteDate[indiceAttuale] = sel ? parseInt(sel.value) : null;
}

// SCHERMATA FINALE
function mostraRisultato() {
    salvaRisposta();
    let punti = 0;
    domande.forEach((d, i) => {
        if (risposteDate[i] === d.corretta) punti++;
    });

    const app = document.getElementById('app-container');
    app.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h1>Test Completato! 🏁</h1>
            <p style="font-size: 20px;">Ottimo lavoro, hai terminato la simulazione.</p>
            <div style="font-size: 60px; font-weight: bold; color: #1a73e8; margin: 20px 0;">
                ${punti} / ${domande.length}
            </div>
            <p>Voto stimato: <b>${(punti/domande.length * 10).toFixed(1)} / 10</b></p>
            <button onclick="location.reload()" style="margin-top:20px;">ESCI</button>
        </div>
    `;
}
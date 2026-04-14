const utentiAutorizzati = {
    "studente1": "scuola2026", "studente2": "pass02", "studente3": "pass03",
    "studente4": "pass04", "studente5": "pass05", "studente6": "pass06",
    "studente7": "pass07", "studente8": "pass08", "studente9": "pass09",
    "studente10": "pass10", "studente11": "pass11", "studente12": "pass12"
};

let domande = [];
let indiceAttuale = 0;
let risposteDate = [];

fetch('domande.json')
    .then(res => res.json())
    .then(data => {
        domande = data;
        document.getElementById('testo-pieno').innerText = domande[0].brano;
    });

function controllaLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (utentiAutorizzati[u] === p) {
        document.getElementById('schermata-login').classList.add('hidden');
        document.getElementById('schermata-lettura').classList.remove('hidden');
    } else { alert("Credenziali errate!"); }
}

function iniziaQuiz() {
    document.getElementById('schermata-lettura').classList.add('hidden');
    document.getElementById('schermata-quiz').classList.remove('hidden');
    mostraDomanda();
}

function mostraDomanda() {
    const d = domande[indiceAttuale];
    document.getElementById('box-brano').innerText = d.brano || domande[0].brano;
    document.getElementById('numero-domanda').innerText = `Domanda ${indiceAttuale + 1} di ${domande.length}`;
    document.getElementById('testo-domanda').innerText = d.testo;
    const contenitore = document.getElementById('lista-opzioni');
    contenitore.innerHTML = '';
    d.opzioni.forEach((opt, i) => {
        contenitore.innerHTML += `<label class="opzione-item"><input type="radio" name="scelta" value="${i}"><span>${opt}</span></label>`;
    });
    const ctrl = document.getElementById('controlli');
    ctrl.innerHTML = (indiceAttuale === domande.length - 1) 
        ? `<button onclick="mostraRisultato()">FINE TEST</button>` 
        : `<button onclick="prossima()">AVANTI »</button>`;
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

function mostraRisultato() {
    salvaRisposta();
    let punti = 0;
    domande.forEach((d, i) => { if (risposteDate[i] === d.corretta) punti++; });

    const nomeStudente = document.getElementById('username').value;
    const urlModulo = "https://docs.google.com/forms/d/e/1FAIpQLSf56DJ2FHaTfHWXP0n80irj02rXVXK837zXIpP7h_1gEnfhFA/formResponse";
    
    const dati = new FormData();
    dati.append("entry.1966425388", nomeStudente); 
    dati.append("entry.1863095868", punti + "/" + domande.length);

    fetch(urlModulo, { method: "POST", mode: "no-cors", body: dati });

    document.getElementById('app-container').innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h1>Test Completato! 🏁</h1>
            <div style="font-size: 60px; font-weight: bold; color: #1a73e8; margin: 20px 0;">${punti} / ${domande.length}</div>
            <p>I risultati sono stati inviati al professore.</p>
            <button onclick="location.reload()">ESCI</button>
        </div>`;
}
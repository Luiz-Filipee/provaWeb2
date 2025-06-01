const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

ws.onopen = () => {
    addLog('Conectado ao servidor.');
};

ws.onmessage = (event) => {
    const msg = event.data; 
    addLog(event.data);

     if (msg.includes('Você é o definidor') || msg.includes('Você é o mestre') || msg.includes('você foi escolhido como mestre')) {
        souMestre = true;
        console.log('Você é mestre agora');
        atualizarStatusMestre();
    }

    if (msg.includes('O número era') || msg.includes('Novo mestre') || msg.includes('Nova rodada')) {
        souMestre = false;
        numeroDefinido = false;
        inputNumero.value = '';
        console.log('Rodada nova, resetando mestre e numeroDefinido');
        atualizarStatusMestre();
    }

};

ws.onclose = () => {
    addLog('Desconectado do servidor.');
};

const inputNumero = document.getElementById('numeroSecreto');
const btnEnviar = document.getElementById('btnEnviarNumero');
const inputPalpite = document.getElementById('palpite');
const btnPalpite = document.getElementById('btnEnviarPalpite');

let souMestre = false;

function atualizarStatusMestre(){
    if(souMestre){
        inputNumero.disabled = false;
        btnEnviar.disabled = false;
        inputPalpite.disabled = true;
        btnPalpite.disabled = true;
    }else{
        inputNumero.disabled = true;
        btnEnviar.disabled = true;
        inputPalpite.disabled = false;
        btnPalpite.disabled = false;
    }
}

function enviarNome() {
    const nome = document.getElementById('nome').value.trim();
    if (nome) {
        ws.send(`nome:${nome}`);
        addLog(`Nome enviado: ${nome}`);
    } else {
        alert('Digite seu nome!');
    }
}

function definirNumero() {
    const numero = document.getElementById('numeroSecreto').value.trim();
    if (numero) {
        ws.send(`numero:${numero}`);
        addLog(`Número secreto definido: ${numero}`);
        numeroDefinido = true;
        atualizarStatusMestre();
    } else {
        alert('Digite o número secreto!');
    }
}

function enviarPalpite() {
    const palpite = document.getElementById('palpite').value.trim();
    if (palpite) {
        ws.send(palpite);
        addLog(`Palpite enviado: ${palpite}`);
    } else {
        alert('Digite seu palpite!');
    }
}

function addLog(msg) {
    const log = document.getElementById('log');
    const div = document.createElement('div');
    div.className = 'msg';
    div.textContent = msg;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

function enviarChat() {
    const mensagem = document.getElementById('mensagemChat').value.trim();
    if (mensagem) {
        ws.send(`chat:${mensagem}`);
        document.getElementById('mensagemChat').value = '';
    } else {
        alert('Digite uma mensagem!');
    }
}
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

let numeroSecreto = gerarNumeroSecreto();
console.log(`Número secreto: ${numeroSecreto}`);

const ranking = new Map();

const jogadores = new Map();

function gerarNumeroSecreto() {
    return Math.floor(Math.random() * 100) + 1;
}

function resetarNumero() {
    numeroSecreto = gerarNumeroSecreto();
    console.log(`Novo número secreto: ${numeroSecreto}`);
}

function gerarRankingTexto() {
    const ordenado = [...ranking.entries()]
        .sort((a, b) => b[1] - a[1]);

    let texto = '\nRanking Atual:\n';
    ordenado.forEach(([nome, pontos], index) => {
        texto += `${index + 1}. ${nome} - ${pontos} ponto${pontos > 1 ? 's' : ''}\n`;
    });

    return texto;
}

wss.on('connection', (ws) => {
    console.log('Novo jogador conectado.');

    ws.send('Bem-vindo ao jogo! Digite seu nome');

    ws.on('message', (message) => {
        const msg = message.toString().trim();

        if (msg.startsWith('nome:')) {
            const nome = msg.split(':')[1].trim();

            if (nome) {
                jogadores.set(ws, nome);
                if (!ranking.has(nome)) {
                    ranking.set(nome, 0);
                }
                ws.send(`Nome registrado como ${nome}. Envie seu palpite!`);
                console.log(`Jogador registrado: ${nome}`);
            } else {
                ws.send('Nome inválido.');
            }
            return;
        }

        if (!jogadores.has(ws)) {
            ws.send('Você precisa definir seu nome primeiro');
            return;
        }

        const nomeJogador = jogadores.get(ws);

        const palpite = parseInt(msg);

        if (isNaN(palpite)) {
            ws.send('Por favor, envie um número válido.');
            return;
        }

        console.log(`Palpite de ${nomeJogador}: ${palpite}`);

        if (palpite === numeroSecreto) {
            const pontosAtuais = ranking.get(nomeJogador) || 0;
            ranking.set(nomeJogador, pontosAtuais + 1);

            const mensagemVencedor = `${nomeJogador} ACERTOU! O número era ${numeroSecreto}.\nNovo jogo começando...\n`;

            const rankingAtual = gerarRankingTexto();

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`${mensagemVencedor}\n\n${rankingAtual}`);
                }
            });

            resetarNumero();
        } else if (palpite < numeroSecreto) {
            ws.send('O número é MAIOR.');
        } else {
            ws.send('O número é MENOR.');
        }
    });

    ws.on('close', () => {
        console.log('Jogador desconectou.');
        jogadores.delete(ws);
    });
});

const PORT = process.env.PORT || 5432;
server.listen(PORT, '192.168.100.63', () => {
    console.log(`Servidor rodando em http://192.168.100.63:${PORT}`);
});

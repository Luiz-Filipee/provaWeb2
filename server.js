const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

let numeroSecreto = null;
let definidor = null; 

const ranking = new Map();
const jogadores = new Map();

function gerarRankingTexto() {
    const ordenado = [...ranking.entries()]
        .sort((a, b) => b[1] - a[1]);

    let texto = '\nRanking Atual:\n';
    ordenado.forEach(([nome, pontos], index) => {
        texto += `${index + 1}. ${nome} - ${pontos} ponto${pontos > 1 ? 's' : ''}\n`;
    });

    return texto;
}

function broadcast(mensagem) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(mensagem);
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Novo jogador conectado.');
    ws.send('Bem-vindo ao jogo! Digite seu nome com:');

    ws.on('message', (message) => {
        const msg = message.toString().trim();

        if (msg.startsWith('chat:')) {
        const textoChat = msg.split(':')[1].trim();

            if (jogadores.has(ws)) {
                const nomeJogador = jogadores.get(ws);
                const mensagem = `[${nomeJogador}]: ${textoChat}`;

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(mensagem);
                    }
                });

                console.log(`Mensagem de chat de ${nomeJogador}: ${textoChat}`);
            } else {
                ws.send('Defina seu nome antes de enviar mensagens no chat.');
            }
            return;
        }

        if (msg.startsWith('nome:')) {
            const nome = msg.split(':')[1].trim();

            if (nome) {
                jogadores.set(ws, nome);
                if (!ranking.has(nome)) {
                    ranking.set(nome, 0);
                }
                ws.send(`Nome registrado como ${nome}.`);

                if (!definidor) {
                    definidor = ws;
                    ws.send('Você é o definidor! Escolha o número secreto com: numero:valor');
                    broadcast(`${nome} é quem define o número secreto!`);
                } else {
                    ws.send('Aguarde o definidor escolher o número secreto...');
                }

                console.log(`Jogador registrado: ${nome}`);
            } else {
                ws.send('Nome inválido.');
            }
            return;
        }

        if (!jogadores.has(ws)) {
            ws.send('Você precisa definir seu nome primeiro.');
            return;
        }

        const nomeJogador = jogadores.get(ws);

        if (msg.startsWith('numero:')) {
            if (ws !== definidor) {
                ws.send('Apenas o definidor pode escolher o número secreto.');
                return;
            }

            const valor = parseInt(msg.split(':')[1].trim());
            if (isNaN(valor) || valor < 1 || valor > 100) {
                ws.send('Número inválido. Escolha um número entre 1 e 100.');
                return;
            }

            numeroSecreto = valor;
            ws.send(`Número secreto definido como ${valor}.`);
            broadcast('Número secreto foi definido! Jogadores podem começar a adivinhar.');
            return;
        }

        if (!numeroSecreto) {
            ws.send('Aguardando o definidor escolher o número secreto.');
            return;
        }

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

            broadcast(`${mensagemVencedor}\n${rankingAtual}\nNovo mestre será escolhido...`);

            escolherMestrePorRanking();
        } else if (palpite < numeroSecreto) {
            ws.send('O número é MAIOR.');
        } else {
            ws.send('O número é MENOR.');
        }
    });

    ws.on('close', () => {
        const nome = jogadores.get(ws);
        console.log(`Jogador ${nome} desconectou.`);
        jogadores.delete(ws);

        if (ws === definidor) {
            broadcast(`O mestre (${nome}) saiu. Escolhendo novo mestre...`);
            escolherMestrePorRanking();
        }
    });
});

function escolherMestrePorRanking() {
    const maxPontos = Math.max(...ranking.values());

    const melhores = [...ranking.entries()].filter(([_, pontos]) => pontos === maxPontos);
    const escolhido = melhores[Math.floor(Math.random() * melhores.length)][0];

    const wsEscolhido = [...jogadores.entries()].find(([ws, nome]) => nome === escolhido)?.[0];

    if (wsEscolhido) {
        definidor = wsEscolhido;
        definidor.send('Você é o novo Mestre da Rodada (Maior pontuação)! Escolha o número com: numero:valor');
        broadcast(`${escolhido} é o novo Mestre da Rodada (Maior pontuação)!`);
        numeroSecreto = null;
    }
}



const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

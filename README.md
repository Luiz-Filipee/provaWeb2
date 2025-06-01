# Jogo de Adivinhação com WebSocket

Jogo multiplayer simples onde um jogador é o mestre e escolhe um número secreto, enquanto os outros jogadores tentam adivinhar esse número em rodadas. A comunicação entre cliente e servidor é feita via WebSocket.

---

## 🚀 Funcionalidades

- Comunicação em tempo real com WebSocket
- Escolha dinâmica do mestre (definidor do número secreto)
- Envio de palpites pelos jogadores
- Controle de permissões para mestre e jogadores (habilita/desabilita inputs)
- Chat integrado para interação entre os participantes
- Exibição de log das mensagens da partida

---

## 🛠️ Tecnologias

- JavaScript (ES6+)
- WebSocket API para comunicação em tempo real
- HTML/CSS para interface básica

---

## 📥 Como usar

### Pré-requisitos

- Servidor WebSocket ativo na porta 3000 (implementação do servidor necessária)
- Navegador moderno com suporte a WebSocket

### Passos para rodar localmente

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/jogo-adivinhacao-websocket.git
cd jogo-adivinhacao-websocket

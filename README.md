Jogo de Adivinhação com WebSocket
Jogo multiplayer simples onde um jogador é o mestre e escolhe um número secreto, e os outros jogadores tentam adivinhar esse número em rodadas. A comunicação entre cliente e servidor é feita usando WebSocket.

Funcionalidades
Comunicação em tempo real via WebSocket

Um jogador é escolhido como mestre para definir o número secreto

Outros jogadores enviam palpites para tentar acertar o número

Atualização dinâmica dos controles com base no status do jogador (mestre ou jogador comum)

Chat integrado para interação entre os jogadores

Log com mensagens da partida exibido no cliente

Como usar
Requisitos
Navegador moderno com suporte a WebSocket

Servidor WebSocket rodando na porta 3000 (a ser implementado)

Execução
Clone este repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/jogo-adivinhacao-websocket.git
cd jogo-adivinhacao-websocket
Abra o arquivo index.html no navegador (ou rode via servidor HTTP para evitar problemas de CORS)

No campo nome, informe seu nome e conecte-se

Se for o mestre, defina o número secreto e aguarde os palpites dos demais jogadores

Os jogadores enviam palpites para tentar adivinhar o número

O jogo avisa quando a rodada termina e um novo mestre é escolhido

Estrutura do Código
index.html: Interface do jogo com campos para nome, número secreto, palpites e chat

script.js: Código JavaScript para controle da comunicação WebSocket e lógica do cliente

server.js (não incluso): Servidor WebSocket que gerencia jogadores, mestres, números secretos e rodadas (é necessário implementar)

Como contribuir
Contribuições são bem-vindas! Para contribuir:

Faça um fork do projeto

Crie uma branch com sua feature (git checkout -b minha-feature)

Faça commit das alterações (git commit -m 'Minha feature')

Envie para o repositório remoto (git push origin minha-feature)

Abra um Pull Request descrevendo suas mudanças

Licença
Este projeto está licenciado sob a licença MIT — veja o arquivo LICENSE para detalhes.


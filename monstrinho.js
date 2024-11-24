
class Campo {
    constructor() {
        this.elemento = document.getElementById('campo');
        this.arrowsSVG = document.getElementById('arrows');
        this.jogadores = [];
        this.bolas = [];
        this.goleiros = [];
        this.jogadoresAdversarios = [];
        this.goleirosAdversarios = [];
        this.setas = [];
        this.currentArrow = null;
        this.originElement = null;
        this.movimentosPlanejados = [];
        this.initDragAndDrop();
        this.initControls();
        this.initArrowDrawing();
        this.initFormacoes();
    }

    initDragAndDrop() {
        const toolbarElements = document.querySelectorAll('#toolbar .elemento');
        toolbarElements.forEach(elem => {
            elem.addEventListener('dragstart', (e) => this.handleDragStart(e, elem.dataset.type));
        });

        this.elemento.addEventListener('dragover', (e) => e.preventDefault());
        this.elemento.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e, tipo) {
        e.dataTransfer.setData('tipo', tipo);
    }

    handleDrop(e) {
        e.preventDefault();
        const tipo = e.dataTransfer.getData('tipo');
        const pos = this.getMousePosition(e);

        if (tipo === 'jogador') {
            this.adicionarJogador(pos.x, pos.y);
        } else if (tipo === 'goleiro') {
            this.adicionarGoleiro(pos.x, pos.y);
        } else if (tipo === 'jogador2') {
            this.adicionarJogadorAdversario(pos.x, pos.y);
        } else if (tipo === 'goleiro2') {
            this.adicionarGoleiroAdversario(pos.x, pos.y);
        } else if (tipo === 'bola') {
            this.adicionarBola(pos.x, pos.y);
        }
    }

    getMousePosition(event) {
        const rect = this.elemento.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }

    adicionarJogador(x, y) {
        const jogador = new Jogador(this.jogadores.length, x, y, this);
        this.jogadores.push(jogador);
        this.elemento.appendChild(jogador.elemento);
    }

    adicionarGoleiro(x, y) {
        const goleiro = new Goleiro(this.goleiros.length, x, y, this);
        this.goleiros.push(goleiro);
        this.elemento.appendChild(goleiro.elemento);
    }

    adicionarBola(x, y) {
        const bola = new Bola(this.bolas.length, x, y, this);
        this.bolas.push(bola);
        this.elemento.appendChild(bola.elemento);
    }

    adicionarJogadorAdversario(x, y) {
        const jogador2 = new JogadorAdversario(this.jogadoresAdversarios.length, x, y, this);
        this.jogadoresAdversarios.push(jogador2);
        this.elemento.appendChild(jogador2.elemento);
    }

    adicionarGoleiroAdversario(x, y) {
        const goleiro2 = new GoleiroAdversario(this.goleirosAdversarios.length, x, y, this);
        this.goleirosAdversarios.push(goleiro2);
        this.elemento.appendChild(goleiro2.elemento);
    }

    initControls() {
        const startBtn = document.getElementById('start');
        const resetBtn = document.getElementById('reset');

        startBtn.addEventListener('click', () => this.iniciarJogada());
        resetBtn.addEventListener('click', () => this.resetarCampo());

        window.addEventListener('resize', () => this.resetarCampo());
    }

    iniciarJogada() {
        this.movimentosPlanejados.forEach(({ element, x, y }) => {
            element.mover(x, y);
        });
        this.movimentosPlanejados = [];
    }

    resetarCampo() {
        this.jogadores.forEach(jogador => jogador.remove());
        this.goleiros.forEach(goleiro => goleiro.remove());
        this.bolas.forEach(bola => bola.remove());
        this.jogadoresAdversarios.forEach(jogador => jogador.remove());
        this.goleirosAdversarios.forEach(goleiro => goleiro.remove());
        this.setas.forEach(seta => seta.remove());
        this.jogadores = [];
        this.goleiros = [];
        this.bolas = [];
        this.jogadoresAdversarios = [];
        this.goleirosAdversarios = [];
        this.setas = [];
        this.movimentosPlanejados = [];
        while (this.arrowsSVG.firstChild) {
            this.arrowsSVG.removeChild(this.arrowsSVG.firstChild);
        }
    }

    initArrowDrawing() {
        this.elemento.addEventListener('click', (e) => this.handleFieldClick(e));
    }

    handleFieldClick(e) {
        const target = e.target.closest('.jogador, .goleiro, .bola');
        const pos = this.getMousePosition(e);

        if (target) {
            const element = this.getElementByDOM(target);
            if (!this.originElement) {
                this.originElement = element;
                target.classList.add('selected');
            } else if (this.originElement === element) {
                this.originElement = null;
                target.classList.remove('selected');
            } else {
                this.adicionarSeta(this.originElement, element);
                this.originElement.elemento.classList.remove('selected');
                this.originElement = null;
            }
        } else {
            if (this.originElement) {
                this.moverParaPosicaoClique(this.originElement, pos.x, pos.y);
                this.originElement.elemento.classList.remove('selected');
                this.originElement = null;
            }
        }
    }

    moverParaPosicaoClique(element, x, y) {
        this.movimentosPlanejados.push({ element, x, y });
    }

    getElementByDOM(domElement) {
        for (let jogador of this.jogadores) {
            if (jogador.elemento === domElement) return jogador;
        }
        for (let goleiro of this.goleiros) {
            if (goleiro.elemento === domElement) return goleiro;
        }
        for (let bola of this.bolas) {
            if (bola.elemento === domElement) return bola;
        }
        for (let jogador of this.jogadoresAdversarios) {
            if (jogador.elemento === domElement) return jogador;
        }
        for (let goleiro of this.goleirosAdversarios) {
            if (goleiro.elemento === domElement) return goleiro;
        }
        return null;
    }

    adicionarSeta(origem, destino) {
        const seta = new Seta(origem, destino, this.arrowsSVG);
        this.setas.push(seta);
        this.movimentosPlanejados.push({
            element: origem,
            x: destino.posicao.x,
            y: destino.posicao.y,
        });
    }

    getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }


    initFormacoes() {
        const botoesEquipe = document.querySelectorAll('.botao-formacao-equipe');
        const botoesAdversario = document.querySelectorAll('.botao-formacao-adversario');

        const botoesEquipeMobile = document.querySelectorAll('.botao-formacao-equipe-mobile');
        const botoesAdversarioMobile = document.querySelectorAll('.botao-formacao-adversario-mobile');

        botoesEquipe.forEach(botao => {
            botao.addEventListener('click', () => {
                this.aplicarFormacaoEquipe(botao.dataset.formacao);
            });
        });

        botoesEquipeMobile.forEach(botao => {
            botao.addEventListener('click', () => {
                this.aplicarFormacaoEquipeMobile(botao.dataset.formacao);
            });
        });

        botoesAdversario.forEach(botao => {
            botao.addEventListener('click', () => {
                this.aplicarFormacaoAdversario(botao.dataset.formacao);
            });
        });

        botoesAdversarioMobile.forEach(botao => {
            botao.addEventListener('click', () => {
                this.aplicarFormacaoAdversarioMobile(botao.dataset.formacao);
            });
        });
    }

    aplicarFormacaoEquipe(formacao) {
        this.resetarCampoEquipe();
        switch (formacao) {
            case '4-4-2':
                this.adicionarJogador(280, 150); // Meio-campista Lateral x
                this.adicionarJogador(280, 250); // Meio-campista Central x
                this.adicionarJogador(280, 350); // Centroavante x
                this.adicionarJogador(280, 450); // Meio-campista Central x
                this.adicionarJogador(500, 150); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(500, 250); // Lateral x
                this.adicionarJogador(500, 350); // Zagueiro Central x
                this.adicionarJogador(500, 450); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(625, 250); // Zagueiro Central x
                this.adicionarJogador(625, 350); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x 
                break;

            case '4-3-3':
                this.adicionarJogador(280, 150); // Meio-campista Lateral x
                this.adicionarJogador(280, 250); // Meio-campista Central x
                this.adicionarJogador(280, 350); // Centroavante x
                this.adicionarJogador(280, 450); // Meio-campista Central x
                this.adicionarJogador(500, 200); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(500, 300); // Lateral x
                this.adicionarJogador(500, 400); // Zagueiro Central x
                this.adicionarJogador(625, 200); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(625, 300); // Zagueiro Central x
                this.adicionarJogador(625, 400); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x 
                break;

            case '3-5-2':
                this.adicionarJogador(280, 200); // Meio-campista Lateral x
                this.adicionarJogador(280, 300); // Meio-campista Central x
                this.adicionarJogador(280, 400); // Centroavante x
                this.adicionarJogador(500, 100); // Meio-campista Central x
                this.adicionarJogador(500, 200); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(500, 300); // Lateral x
                this.adicionarJogador(500, 400); // Zagueiro Central x
                this.adicionarJogador(500, 500); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(625, 250); // Zagueiro Central x
                this.adicionarJogador(625, 350); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x 
                break;

            case '4-2-3-1':
                this.adicionarJogador(280, 150); // Meio-campista Lateral x
                this.adicionarJogador(280, 250); // Meio-campista Central x
                this.adicionarJogador(280, 350); // Centroavante x
                this.adicionarJogador(280, 450); // Meio-campista Central x
                this.adicionarJogador(400, 250); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(400, 350); // Lateral x
                this.adicionarJogador(520, 200); // Zagueiro Central x
                this.adicionarJogador(520, 300); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(520, 400); // Zagueiro Central x
                this.adicionarJogador(625, 300); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x  
                break;

            case '5-3-2':
                this.adicionarJogador(280, 100); // Meio-campista Lateral x
                this.adicionarJogador(280, 200); // Meio-campista Central x
                this.adicionarJogador(280, 300); // Centroavante x
                this.adicionarJogador(280, 400); // Meio-campista Central x
                this.adicionarJogador(280, 500); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(500, 100); // Lateral x
                this.adicionarJogador(500, 300); // Zagueiro Central x
                this.adicionarJogador(500, 500); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(625, 250); // Zagueiro Central x
                this.adicionarJogador(625, 350); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x 
                break;

            case '3-4-3':
                this.adicionarJogador(280, 200); // Meio-campista Lateral x
                this.adicionarJogador(280, 300); // Meio-campista Central x
                this.adicionarJogador(280, 400); // Centroavante x
                this.adicionarJogador(500, 150); // Meio-campista Central x
                this.adicionarJogador(500, 250); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(500, 350); // Lateral x
                this.adicionarJogador(500, 450); // Zagueiro Central x
                this.adicionarJogador(625, 200); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(625, 300); // Zagueiro Central x
                this.adicionarJogador(625, 400); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x 
                break;

            case '4-1-4-1':
                this.adicionarJogador(280, 150); // Meio-campista Lateral x
                this.adicionarJogador(280, 250); // Meio-campista Central x
                this.adicionarJogador(280, 350); // Centroavante x
                this.adicionarJogador(280, 450); // Meio-campista Central x
                this.adicionarJogador(400, 300); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(520, 150); // Lateral x
                this.adicionarJogador(520, 250); // Zagueiro Central x
                this.adicionarJogador(520, 350); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(520, 450); // Zagueiro Central x
                this.adicionarJogador(625, 300); // Lateral x
                this.adicionarGoleiro(50, 300); // Goleiro x        
                break;
        }
    }

    aplicarFormacaoAdversario(formacao) {
        this.resetarCampoAdversario(); // Isso aqui limpa, para que toda vez que clicarem para alterar ele limpa o que estiver antes.
        switch (formacao) {
            case '4-4-2':
                this.adicionarJogadorAdversario(625, 150); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 250); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 350); // Centroavante x
                this.adicionarJogadorAdversario(625, 450); // Meio-campista Central x
                this.adicionarJogadorAdversario(400, 150); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(400, 250); // Lateral x
                this.adicionarJogadorAdversario(400, 350); // Zagueiro Central x
                this.adicionarJogadorAdversario(400, 450); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(280, 250); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 350); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x  
                break;

            case '4-3-3':
                this.adicionarJogadorAdversario(625, 150); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 250); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 350); // Centroavante x
                this.adicionarJogadorAdversario(625, 450); // Meio-campista Central x
                this.adicionarJogadorAdversario(400, 200); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(400, 300); // Lateral x
                this.adicionarJogadorAdversario(400, 400); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 200); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(280, 300); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 400); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x  
                break;

            case '3-5-2':
                this.adicionarJogadorAdversario(625, 200); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 300); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 400); // Centroavante x
                this.adicionarJogadorAdversario(400, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(400, 200); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(400, 300); // Lateral x
                this.adicionarJogadorAdversario(400, 400); // Zagueiro Central x
                this.adicionarJogadorAdversario(400, 500); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(280, 250); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 350); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x  
                break;

            case '4-2-3-1':
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 100); // Centroavante x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(500, 140); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(500, 140); // Lateral x
                this.adicionarJogadorAdversario(350, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(350, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(350, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(250, 220); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x   
                break;

            case '5-3-2':
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 100); // Centroavante x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 100); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(400, 180); // Lateral x
                this.adicionarJogadorAdversario(400, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(400, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(280, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 220); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x   
                break;

            case '3-4-3':
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 100); // Centroavante x
                this.adicionarJogadorAdversario(400, 180); // Meio-campista Central x
                this.adicionarJogadorAdversario(400, 180); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(400, 180); // Lateral x
                this.adicionarJogadorAdversario(400, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 220); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(280, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(280, 220); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x   
                break;

            case '4-1-4-1':
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(625, 100); // Centroavante x
                this.adicionarJogadorAdversario(625, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(500, 140); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(350, 180); // Lateral x
                this.adicionarJogadorAdversario(350, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(350, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(350, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(250, 220); // Lateral x
                this.adicionarGoleiroAdversario(840, 300); // Goleiro x        
                break;
        }
    }



    aplicarFormacaoEquipeMobile(formacao) {
        this.resetarCampoEquipe();
        switch (formacao) {
            case '4-4-2':
                this.adicionarJogador(50, 220); // Meio-campista Lateral x
                this.adicionarJogador(90, 220); // Meio-campista Central x
                this.adicionarJogador(130, 220); // Centroavante x
                this.adicionarJogador(170, 220); // Meio-campista Central x
                this.adicionarJogador(50, 140); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(90, 140); // Lateral x
                this.adicionarJogador(130, 140); // Zagueiro Central x
                this.adicionarJogador(170, 140); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(90, 100); // Zagueiro Central x
                this.adicionarJogador(130, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x 
                break;

            case '4-3-3':
                this.adicionarJogador(50, 220); // Meio-campista Lateral x
                this.adicionarJogador(90, 220); // Meio-campista Central x
                this.adicionarJogador(130, 220); // Centroavante x
                this.adicionarJogador(170, 220); // Meio-campista Central x
                this.adicionarJogador(70, 140); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(110, 140); // Lateral x
                this.adicionarJogador(150, 140); // Zagueiro Central x
                this.adicionarJogador(70, 100); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(110, 100); // Zagueiro Central x
                this.adicionarJogador(150, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x 
                break;

            case '3-5-2':
                this.adicionarJogador(70, 220); // Meio-campista Lateral x
                this.adicionarJogador(110, 220); // Meio-campista Central x
                this.adicionarJogador(150, 220); // Centroavante x
                this.adicionarJogador(50, 140); // Meio-campista Central x
                this.adicionarJogador(80, 140); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(110, 140); // Lateral x
                this.adicionarJogador(140, 140); // Zagueiro Central x
                this.adicionarJogador(170, 140); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(90, 100); // Zagueiro Central x
                this.adicionarJogador(130, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x 
                break;

            case '4-2-3-1':
                this.adicionarJogador(50, 220); // Meio-campista Lateral x
                this.adicionarJogador(90, 220); // Meio-campista Central x
                this.adicionarJogador(130, 220); // Centroavante x
                this.adicionarJogador(170, 220); // Meio-campista Central x
                this.adicionarJogador(90, 180); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(130, 180); // Lateral x
                this.adicionarJogador(70, 140); // Zagueiro Central x
                this.adicionarJogador(110, 140); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(150, 140); // Zagueiro Central x
                this.adicionarJogador(110, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x  
                break;

            case '5-3-2':
                this.adicionarJogador(50, 220); // Meio-campista Lateral x
                this.adicionarJogador(80, 220); // Meio-campista Central x
                this.adicionarJogador(110, 220); // Centroavante x
                this.adicionarJogador(140, 220); // Meio-campista Central x
                this.adicionarJogador(170, 220); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(50, 140); // Lateral x
                this.adicionarJogador(110, 140); // Zagueiro Central x
                this.adicionarJogador(170, 140); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(90, 100); // Zagueiro Central x
                this.adicionarJogador(130, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x 
                break;

            case '3-4-3':
                this.adicionarJogador(70, 220); // Meio-campista Lateral x
                this.adicionarJogador(110, 220); // Meio-campista Central x
                this.adicionarJogador(150, 220); // Centroavante x
                this.adicionarJogador(50, 140); // Meio-campista Central x
                this.adicionarJogador(90, 140); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(130, 140); // Lateral x
                this.adicionarJogador(170, 140); // Zagueiro Central x
                this.adicionarJogador(70, 100); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(110, 100); // Zagueiro Central x
                this.adicionarJogador(150, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x 
                break;

            case '4-1-4-1':
                this.adicionarJogador(50, 220); // Meio-campista Lateral x
                this.adicionarJogador(90, 220); // Meio-campista Central x
                this.adicionarJogador(130, 220); // Centroavante x
                this.adicionarJogador(170, 220); // Meio-campista Central x
                this.adicionarJogador(110, 180); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogador(50, 140); // Lateral x
                this.adicionarJogador(90, 140); // Zagueiro Central x
                this.adicionarJogador(130, 140); // Volante (Meio-campista Defensivo) x
                this.adicionarJogador(170, 140); // Zagueiro Central x
                this.adicionarJogador(110, 100); // Lateral x
                this.adicionarGoleiro(110, 300); // Goleiro x        
                break;
        }
    }

    aplicarFormacaoAdversarioMobile(formacao) {
        this.resetarCampoAdversario(); // Isso aqui limpa, para que toda vez que clicarem para alterar ele limpa o que estiver antes.
        switch (formacao) {
            case '4-4-2':
                this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(130, 100); // Centroavante x
                this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(50, 180); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(90, 180); // Lateral x
                this.adicionarJogadorAdversario(130, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(170, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(90, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(130, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x  
                break;

            case '4-3-3':
                this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(130, 100); // Centroavante x
                this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(70, 180); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(110, 180); // Lateral x
                this.adicionarJogadorAdversario(150, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(70, 220); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(110, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(150, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x 
                break;

            case '3-5-2':
                this.adicionarJogadorAdversario(70, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(110, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(150, 100); // Centroavante x
                this.adicionarJogadorAdversario(50, 180); // Meio-campista Central x
                this.adicionarJogadorAdversario(80, 180); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(110, 180); // Lateral x
                this.adicionarJogadorAdversario(140, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(170, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(90, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(130, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                break;

            case '4-2-3-1':
                this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(130, 100); // Centroavante x
                this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(90, 140); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(130, 140); // Lateral x
                this.adicionarJogadorAdversario(70, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(110, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(150, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(110, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                break;

            case '5-3-2':
                this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(80, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(110, 100); // Centroavante x
                this.adicionarJogadorAdversario(140, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(170, 100); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(50, 180); // Lateral x
                this.adicionarJogadorAdversario(110, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(170, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(90, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(130, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                break;

            case '3-4-3':
                this.adicionarJogadorAdversario(70, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(110, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(150, 100); // Centroavante x
                this.adicionarJogadorAdversario(50, 180); // Meio-campista Central x
                this.adicionarJogadorAdversario(90, 180); // Zagueiro Central x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(130, 180); // Lateral x
                this.adicionarJogadorAdversario(170, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(70, 220); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(110, 220); // Zagueiro Central x
                this.adicionarJogadorAdversario(150, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                break;

            case '4-1-4-1':
                this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(130, 100); // Centroavante x
                this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                this.adicionarJogadorAdversario(110, 140); // Meio-campista Lateral x
                //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                //------------------ Passou do meio de campo ---------------------//
                this.adicionarJogadorAdversario(50, 180); // Lateral x
                this.adicionarJogadorAdversario(90, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(130, 180); // Volante (Meio-campista Defensivo) x
                this.adicionarJogadorAdversario(170, 180); // Zagueiro Central x
                this.adicionarJogadorAdversario(110, 220); // Lateral x
                this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                break;
        }
    }


    resetarCampoEquipe() {
        this.jogadores.forEach(jogador => jogador.remove());
        this.goleiros.forEach(goleiro => goleiro.remove());
        this.jogadores = [];
        this.goleiros = [];
    }

    resetarCampoAdversario() {
        this.jogadoresAdversarios.forEach(jogador => jogador.remove());
        this.goleirosAdversarios.forEach(goleiro => goleiro.remove());
        this.jogadoresAdversarios = [];
        this.goleirosAdversarios = [];
    }
}


class Jogador {
    constructor(id, x, y, campo) {
        this.id = id;
        this.campo = campo;
        this.posicao = { x, y };
        this.elemento = this.criarElemento();
        this.definirPosicaoInicial();
        this.initDrag();
    }

    criarElemento() {
        const jogador = document.createElement('div');
        jogador.classList.add('jogador');
        jogador.setAttribute('draggable', 'false');
        jogador.innerHTML = `<img src="img/jogador.png" alt="Jogador">`;
        return jogador;
    }

    definirPosicaoInicial() {
        setTimeout(() => {
            this.elemento.style.left = `${this.posicao.x - this.elemento.offsetWidth / 2}px`;
            this.elemento.style.top = `${this.posicao.y - this.elemento.offsetHeight / 2}px`;
        }, 0);
    }

    initDrag() {
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        this.elemento.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = this.elemento.getBoundingClientRect();
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
            this.elemento.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const campoRect = this.campo.elemento.getBoundingClientRect();
                let x = e.clientX - campoRect.left - offset.x + this.elemento.offsetWidth / 2;
                let y = e.clientY - campoRect.top - offset.y + this.elemento.offsetHeight / 2;

                x = Math.max(0, Math.min(x, this.campo.elemento.offsetWidth));
                y = Math.max(0, Math.min(y, this.campo.elemento.offsetHeight));

                this.elemento.style.left = `${x}px`;
                this.elemento.style.top = `${y}px`;
                this.posicao = { x, y };
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.elemento.style.cursor = 'grab';
            }
        });
    }

    mover(x, y) {
        this.elemento.style.transition = 'left 1.5s, top 1.5s';
        this.elemento.style.left = `${x - this.elemento.offsetWidth / 2}px`;
        this.elemento.style.top = `${y - this.elemento.offsetHeight / 2}px`;
        this.posicao = { x, y };
        setTimeout(() => {
            this.elemento.style.transition = '';
        }, 1500);
    }

    remove() {
        this.elemento.remove();
    }
}

class Goleiro extends Jogador {
    criarElemento() {
        const goleiro = document.createElement('div');
        goleiro.classList.add('goleiro');
        goleiro.setAttribute('draggable', 'false');
        goleiro.innerHTML = `<img src="img/goleiro.png" alt="Goleiro">`;
        return goleiro;
    }
}

class Bola extends Jogador {
    criarElemento() {
        const bola = document.createElement('div');
        bola.classList.add('bola');
        bola.setAttribute('draggable', 'false');
        bola.innerHTML = `<img src="img/bola.png" alt="Bola">`;
        return bola;
    }

    mover(x, y) {
        this.elemento.style.transition = 'left 0.5s, top 0.5s';
        this.elemento.style.left = `${x - this.elemento.offsetWidth / 2}px`;
        this.elemento.style.top = `${y - this.elemento.offsetHeight / 2}px`;
        this.posicao = { x, y };
        setTimeout(() => {
            this.elemento.style.transition = '';
        }, 500);
    }
}

class JogadorAdversario extends Jogador {
    criarElemento() {
        const jogador2 = document.createElement('div');
        jogador2.classList.add('jogador');
        jogador2.setAttribute('draggable', 'false');
        jogador2.innerHTML = `<img src="img/jogador2.png" alt="Jogador Adversário">`;
        return jogador2;
    }
}

class GoleiroAdversario extends Goleiro {
    criarElemento() {
        const goleiro2 = document.createElement('div');
        goleiro2.classList.add('goleiro');
        goleiro2.setAttribute('draggable', 'false');
        goleiro2.innerHTML = `<img src="img/goleiro2.png" alt="Goleiro Adversário">`;
        return goleiro2;
    }
}

class Seta {
    constructor(origem, destino, svgElement) {
        this.origem = origem;
        this.destino = destino;
        this.svgElement = svgElement;
        this.desenharSeta();
    }

    desenharSeta() {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", this.origem.posicao.x);
        line.setAttribute("y1", this.origem.posicao.y);
        line.setAttribute("x2", this.destino.posicao.x);
        line.setAttribute("y2", this.destino.posicao.y);
        line.setAttribute("stroke", "var(--cor-seta)");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-end", "url(#arrowhead)");
        this.svgElement.appendChild(line);
    }

    remove() {}
}

document.addEventListener('DOMContentLoaded', () => {
    const campo = new Campo();
});

var menuItem = document.querySelectorAll('.item-menu');

function selectLink() {
    menuItem.forEach((item) => item.classList.remove('ativo'));
    this.classList.add('ativo');
}

menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
);

var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir');

    if (menuSide.classList.contains('expandir')) {
        menuSide.style.overflow = 'auto';
    } else {
        menuSide.style.overflow = 'hidden';
    }

    document.getElementById('toolbar').classList.toggle('open');
});

import { Draggable } from "gsap/Draggable";

export function addPlayer() {
    const campo = document.getElementById("campo");

    // Criar o elemento do jogador
    const jogador = document.createElement("div");
    jogador.classList.add("jogador");

    // Posicionar aleatoriamente no campo
    jogador.style.left = `${Math.random() * 80 + 10}%`;
    jogador.style.top = `${Math.random() * 80 + 10}%`;

    // Adicionar ao campo
    campo.appendChild(jogador);

    // Tornar o jogador arrastável
    Draggable.create(jogador, {
        type: "x,y",
        bounds: "#campo",
        onDragEnd: function () {
            console.log(`Jogador movido para X=${this.x}, Y=${this.y}`);
        },
    });
}

export function initializePlayers() {
    const jogadores = document.querySelectorAll(".jogador");

    jogadores.forEach((jogador) => {
        Draggable.create(jogador, {
            type: "x,y",
            bounds: "#campo",
            onDragEnd: function () {
                console.log(`Jogador movido para X=${this.x}, Y=${this.y}`);
            },
        });
    });
}

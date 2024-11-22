import { Draggable } from "gsap/Draggable";

// Inicialização do campo e elementos dinâmicos
document.addEventListener("DOMContentLoaded", () => {
    const campo = document.getElementById("campo");

    // Adicionar jogador
    const addJogadorButton = document.getElementById("add-jogador");
    addJogadorButton.addEventListener("click", () => {
        const jogador = document.createElement("div");
        jogador.classList.add("jogador");
        jogador.style.left = `${Math.random() * 80 + 10}%`;
        jogador.style.top = `${Math.random() * 80 + 10}%`;
        campo.appendChild(jogador);

        // Tornar o jogador arrastável
        Draggable.create(jogador, {
            type: "x,y",
            bounds: "#campo",
            onDragEnd: function () {
                console.log(`Jogador movido para X=${this.x}, Y=${this.y}`);
            },
        });
    });

    // Iniciar jogada
    const iniciarJogadaButton = document.getElementById("iniciar-jogada");
    iniciarJogadaButton.addEventListener("click", () => {
        const jogadores = document.querySelectorAll(".jogador");
        jogadores.forEach((jogador, index) => {
            gsap.to(jogador, {
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                duration: 1.5,
                ease: "power1.inOut",
                onComplete: () => {
                    console.log(`Jogador ${index + 1} completou o movimento.`);
                },
            });
        });
    });
});

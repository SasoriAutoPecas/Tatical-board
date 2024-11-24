import { Draggable } from "../libs/gsap.min.js";
import { initializeUI } from "./ui.js";
import { addPlayer, initializePlayers } from "./players.js";

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar UI e eventos
    initializeUI();

    // Botão para adicionar jogador
    document.getElementById("add-jogador").addEventListener("click", () => {
        addPlayer(); // Adicionar lógica do jogador do módulo players.js
    });

    // Inicializar lógica de movimentação dos jogadores
    initializePlayers();
});

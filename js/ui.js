export function initializeUI() {
    const configModal = document.getElementById("config-modal");
    const saveConfigButton = document.getElementById("save-config");
    const cancelConfigButton = document.getElementById("cancel-config");

    // Salvar configurações do jogador
    saveConfigButton.addEventListener("click", () => {
        if (window.selectedPlayer) {
            window.selectedPlayer.dataset.name = document.getElementById("player-name").value;
            window.selectedPlayer.dataset.number = document.getElementById("player-number").value;
            window.selectedPlayer.style.backgroundColor = document.getElementById("player-color").value;

            console.log(`Configurações salvas: Nome=${window.selectedPlayer.dataset.name}`);
            configModal.style.display = "none";
        }
    });

    // Cancelar configuração
    cancelConfigButton.addEventListener("click", () => {
        configModal.style.display = "none";
    });
}

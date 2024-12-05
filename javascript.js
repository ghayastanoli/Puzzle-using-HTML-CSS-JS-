const buttons = Array.from(document.querySelectorAll("#button-container button"));
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const textArea = document.querySelector(".text");

let moveCount = 0;
let draggedButton = null;
let gameActive = false; 
let highScore = Infinity; 


function shuffleButtons() {
    const parent = document.getElementById("button-container");
    const shuffledButtons = buttons.sort(() => Math.random() - 0.5);
    shuffledButtons.forEach(button => parent.appendChild(button));

    moveCount = 0;
    textArea.value = "Game Started! Rearrange the buttons in the right order.";
    gameActive = true; 
}


function checkOrder() {
    const currentOrder = Array.from(document.getElementById("button-container").children).map(
        button => button.textContent
    );
    const correctOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return currentOrder.every((value, index) => value === correctOrder[index]);
}


buttons.forEach(button => {
    button.addEventListener("dragstart", event => {
        if (!gameActive) {
            event.preventDefault();
            return;
        }
        draggedButton = event.target;
    });

    button.addEventListener("dragover", event => {
        event.preventDefault(); 
    });

    button.addEventListener("drop", event => {
        if (!gameActive) return;

        event.preventDefault();
        const targetButton = event.target;

        
        if (draggedButton !== targetButton) {
            const draggedButtonContent = draggedButton.innerHTML;
            const targetButtonContent = targetButton.innerHTML;

            draggedButton.innerHTML = targetButtonContent;
            targetButton.innerHTML = draggedButtonContent;

            moveCount++;
            textArea.value = `Moves: ${moveCount}`;

            if (checkOrder()) {
                textArea.value = `You won in ${moveCount} moves!\n`;

                if (moveCount < highScore) {
                    highScore = moveCount;
                    textArea.value += `Congratulations! New High Score! ${highScore} moves.`;
                } else {
                    textArea.value += ` High Score: ${highScore} moves.`;
                }

                gameActive = false; 
            }
        }
    });
});

startButton.addEventListener("click", shuffleButtons);

resetButton.addEventListener("click", () => {
    const parent = document.getElementById("button-container");
    buttons.sort((a, b) => a.textContent - b.textContent).forEach(button => parent.appendChild(button));
    moveCount = 0;
    textArea.value = "Game Reset! Press the start button to play";
    gameActive = false; 
});


window.onload = () => {
    const popupOverlay = document.getElementById("popup-overlay");
    const closePopupButton = document.getElementById("close-popup");

    popupOverlay.style.display = "flex";

    closePopupButton.addEventListener("click", () => {
        popupOverlay.style.display = "none"; 
        textArea.value = "Press the start button to begin!";
    });
};


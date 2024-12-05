const buttons = Array.from(document.querySelectorAll("#button-container button"));
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const textArea = document.querySelector(".text");

let moveCount = 0;
let draggedButton = null;
let gameActive = false; 
let highScore = Infinity; 

// Helper to calculate row and column of a button
function getButtonPosition(button) {
    const parent = document.getElementById("button-container");
    const children = Array.from(parent.children);
    const index = children.indexOf(button);
    const row = Math.floor(index / 3); // 3 columns
    const col = index % 3;
    return { row, col };
}

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

        // Ensure the move is not diagonal
        const draggedPos = getButtonPosition(draggedButton);
        const targetPos = getButtonPosition(targetButton);

        const isSameRow = draggedPos.row === targetPos.row;
        const isSameCol = draggedPos.col === targetPos.col;

        if (draggedButton !== targetButton && (isSameRow || isSameCol)) {
            // Swap button content
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
        } else {
            textArea.value = `Invalid move!`;
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

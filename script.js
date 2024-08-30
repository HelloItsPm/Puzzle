document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const piecesContainer = document.getElementById('pieces-container');
    const message = document.getElementById('message');
    const restartBtn = document.getElementById('restart-btn');

    const gridSize = 5;
    const pieceSize = 120; // Taille d'une pièce en pixels
    let placedPieces = 0;
    let draggedPiece = null;

    // Crée un tableau avec les indices des pièces
    const pieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    // Crée les cellules de la grille
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.id = i;
        cell.style.width = `${pieceSize}px`;
        cell.style.height = `${pieceSize}px`;
        grid.appendChild(cell);
    }

    // Création et mélange des pièces du puzzle
    createAndShufflePieces();

    function createAndShufflePieces() {
        const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

        shuffledPieces.forEach((number) => {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.draggable = true;
            piece.dataset.id = number; // ID fixe de la pièce

            // Calcule la position de l'image pour cette pièce
            const row = Math.floor(number / gridSize);
            const col = number % gridSize;
            piece.style.backgroundImage = "url('./assets/Puzzle1.png')";
            piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;

            piecesContainer.appendChild(piece);

            // Ajoute les événements de drag and drop
            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('dragend', dragEnd);
        });

        // Mélange les pièces dans le conteneur des pièces
        shufflePieces();
    }

    function shufflePieces() {
        const piecesArray = Array.from(piecesContainer.children);
        piecesArray.forEach(piece => {
            piece.style.order = Math.floor(Math.random() * piecesArray.length);
        });
    }

    function dragStart(e) {
        draggedPiece = e.target;
        e.dataTransfer.setData('text/plain', draggedPiece.dataset.id);
        draggedPiece.style.opacity = '0.5';
    }

    function dragEnd(e) {
        e.target.style.opacity = '1';
        draggedPiece = null;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const target = e.target;

        if (target.classList.contains('grid-cell')) {
            if (target.children.length === 0) {
                // La cellule est vide, place la pièce dans la cellule
                target.appendChild(draggedPiece);
                placedPieces++;
            } else {
                // La cellule est occupée, remplace la pièce en place
                const existingPiece = target.querySelector('.piece');
                if (existingPiece) {
                    // Déplace l'ancienne pièce dans le conteneur des pièces
                    piecesContainer.appendChild(existingPiece);
                    placedPieces--;
                }
                target.appendChild(draggedPiece);
                placedPieces++;
            }
            draggedPiece.style.cursor = 'default';
            checkCompletion();
        } else if (target === piecesContainer || target.classList.contains('piece')) {
            // Déplace la pièce dans le conteneur des pièces
            piecesContainer.appendChild(draggedPiece);
            placedPieces--;
            checkCompletion();
        }
    }

    function checkCompletion() {
        let allCorrect = true;

        // Vérifie chaque cellule pour voir si la pièce correcte est à la bonne place
        grid.querySelectorAll('.grid-cell').forEach(cell => {
            const piece = cell.querySelector('.piece');
            if (piece) {
                const pieceId = parseInt(piece.dataset.id, 10);
                const cellId = parseInt(cell.dataset.id, 10);
                if (pieceId !== cellId) {
                    allCorrect = false;
                }
            } else {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            message.style.display = 'block';
        } else {
            message.style.display = 'none';
        }
    }

    restartBtn.addEventListener('click', () => {
        location.reload();
    });

    // Ajoute les événements de drag and drop pour la grille et le conteneur des pièces
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
    piecesContainer.addEventListener('dragover', dragOver);
    piecesContainer.addEventListener('drop', drop);
});

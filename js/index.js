let totalCols = 10;
let totalRows = 10;


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Déterminer si une cellule a un élément
 * @param cellX
 * @param cellY
 * @param elements
 * @returns {boolean}
 */
function cellHasElement(cellX, cellY, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].x === cellX && elements[i].y === cellY) {
            return elements[i];
        }
    }
    return null;
}

function createGrid(nbRows, nbCols, obstacles, weapons, players, moveCoordinates) {
    const game = document.querySelector('#game')
    let tbody = ''
    for (let y = 0; y < nbRows; y++) {
        tbody += '<tr>'
        for (let x = 0; x < nbCols; x++) {
            if (cellHasElement(x, y, obstacles)) {
                tbody += '<td class="obstacle" data-x="' + x + '" data-y="' + y + '"></td>'
            } else if (cellHasElement(x, y, weapons)) {
                tbody += '<td class="weapon" data-x="' + x + '" data-y="' + y + '"></td>'
            } else if (cellHasElement(x, y, players)) {
                const player = cellHasElement(x, y, players)
                if (player.active) {
                    tbody += '<td class="player active" data-x="' + x + '" data-y="' + y + '"></td>'
                } else {
                    tbody += '<td class="player" data-x="' + x + '" data-y="' + y + '"></td>'
                }
            } else {
                tbody += '<td data-x="' + x + '" data-y="' + y + '"></td>'
            }
        }
        tbody += '</tr>'
    }

    game.innerHTML = '<table><tbody>' + tbody + '</tbody></table>';

    for (let i = 0; i < moveCoordinates.length; i++) {
        const td = document.querySelector('td[data-x="' + moveCoordinates[i].x + '"][data-y="' + moveCoordinates[i].y + '"]')
        if (td) {
            td.classList.add('movable')
            td.addEventListener('click', function(e){
                moveActivePlayer(e.target.dataset.x, e.target.dataset.y)
            })
        }
    }
}

/**
 * Tableau de coordonnées des éléments de notre grille
 * @param nbElements
 * @param coordinates
 * @returns {*[]}
 */
function createElements(nbElements, coordinates = [], excludeCoordinates = []) {
    if (coordinates.length === nbElements) {
        return coordinates;
    }

    const coordinate = {
        x: getRandomNumber(0, totalCols - 1),
        y: getRandomNumber(0, totalRows - 1)
    }

    let coordinateExists = false;
    /**
     * On vérifie que la case est vide
     * la case est vide si notre coordonnées n'apparait pas dans le tableau coordinates
     * ni que la case est déjà prise par un autre élément
     * ex: Pour les armes, on vérifie que la case n'a pas déjà une arme et n'a pas d'obstacle
     */
    for (let j = 0; j < coordinates.length; j++) {
        // Pour les armes, on vérifie que la case n'a pas déjà une arme
        if (coordinate.x === coordinates[j].x && coordinate.y === coordinates[j].y) {
            coordinateExists = true;
        }
    }

    for (let k = 0; k < excludeCoordinates.length; k++) {
        // Pour les armes, on vérifie que la case n'a pas déjà un obstacle
        if (coordinate.x === excludeCoordinates[k].x && coordinate.y === excludeCoordinates[k].y) {
            coordinateExists = true;
        }
    }

    if (!coordinateExists) {
        coordinates.push(coordinate)
    }

    // Appel récursif: Appel de la fonction dans la fonction
    return createElements(nbElements, coordinates, excludeCoordinates)
}

function playerMove(players, obstacles, totalRows, totalCols) {
    const moveCoordinates = [];
    // Récupérer les coordonnées du joueur actif
    let playerActive = null;
    if (players[0].active) {
        playerActive = players[0];
    } else {
        playerActive = players[1]
    }

    // Déterminer si possibilité de déplacement en haut
    let obstacleFound = false;
    for (let y = playerActive.y - 1; y >= playerActive.y - 3; y--) {
        const cell = {x: playerActive.x, y}
        //Tester si la cellule a un obstacle et qu'aucun obstacle n'a été trouvé sur le chemin
        if (cellHasElement(cell.x, cell.y, obstacles) === null && obstacleFound === false) {
            moveCoordinates.push(cell)
        } else {
            obstacleFound = true;
        }
    }

    // Déterminer si possibilité de déplacement en bas
    obstacleFound = false;
    for (let y = playerActive.y + 1; y <= playerActive.y + 3; y++) {
        const cell = {x: playerActive.x, y}
        //Tester si la cellule a un obstacle et qu'aucun obstacle n'a été trouvé sur le chemin
        if (cellHasElement(cell.x, cell.y, obstacles) === null && obstacleFound === false) {
            moveCoordinates.push(cell)
        } else {
            obstacleFound = true;
        }
    }

    // Déterminer si possibilité de déplacement à gauche
    obstacleFound = false;
    for (let x = playerActive.x - 1; x >= playerActive.x - 3; x--) {
        const cell = {x, y: playerActive.y}
        //Tester si la cellule a un obstacle et qu'aucun obstacle n'a été trouvé sur le chemin
        if (cellHasElement(cell.x, cell.y, obstacles) === null && obstacleFound === false) {
            moveCoordinates.push(cell)
        } else {
            obstacleFound = true;
        }
    }

    // Déterminer si possibilité de déplacement à droite
    obstacleFound = false;
    for (let x = playerActive.x + 1; x <= playerActive.x + 3; x++) {
        const cell = {x, y: playerActive.y}
        //Tester si la cellule a un obstacle et qu'aucun obstacle n'a été trouvé sur le chemin
        if (cellHasElement(cell.x, cell.y, obstacles) === null && obstacleFound === false) {
            moveCoordinates.push(cell)
        } else {
            obstacleFound = true;
        }
    }

    return moveCoordinates;
}

/**
 * Etape 1 - Dessin de la grille et positionnement des éléménts
 */
const obstacles = createElements(20);
const weapons = createElements(4, [], obstacles);
const playersCoordinates = createElements(2, [], weapons.concat(obstacles));
/**
 * Créer des objets de type Player qui contiennent les coordonnées et la propriété active pour gérer le tour par tour
 */
const players = [];
for (let i = 0; i < playersCoordinates.length; i++) {
    const player = new Player(playersCoordinates[i].x, playersCoordinates[i].y, false)
    players.push(player)
}
players[0].active = true;
const moveCoordinates = playerMove(players, obstacles)
createGrid(totalRows, totalCols, obstacles, weapons, players, moveCoordinates);

/**
 * Etape 2 - Déplacement des joueurs
 */
function moveActivePlayer(x, y){
    for(let i = 0; i < players.length; i++){
        // Mise à jour des nouvelles coordonnées du player actif et changement de joueur
        if(players[i].active){
            players[i].x = parseInt(x)
            players[i].y = parseInt(y)
            players[i].active = false
        } else {
            players[i].active = true
        }
    }

    // Puisque c'est un nouveau joueur, on détermine les coordonnées de déplacement possible
    const moveCoordinates = playerMove(players, obstacles)

    // Redessiner la grille
    createGrid(totalRows, totalCols, obstacles, weapons, players, moveCoordinates);
}

// Prise d'une nouvelle arme

/**
 * Etape 3 - Combat
 */



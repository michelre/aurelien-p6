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
            return true
        }
    }
    return false;
}

function createGrid(nbRows, nbCols, obstacles, weapons, players) {
    const game = document.querySelector('#game')
    let tbody = ''
    for (let y = 0; y < nbRows; y++) {
        tbody += '<tr>'
        for (let x = 0; x < nbCols; x++) {
            if (cellHasElement(x, y, obstacles)) {
                tbody += '<td class="obstacle" data-x="' + x + '" data-y="' + y + '"></td>'
            }
            else if (cellHasElement(x, y, weapons)) {
                tbody += '<td class="weapon" data-x="' + x + '" data-y="' + y + '"></td>'
            }
            else if (cellHasElement(x, y, players)) {
                    tbody += '<td class="player" data-x="' + x + '" data-y="' + y + '"></td>'
            } else {
                tbody += '<td data-x="' + x + '" data-y="' + y + '"></td>'
            }
        }
        tbody += '</tr>'
    }

    game.innerHTML = '<table><tbody>' + tbody + '</tbody></table>';
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

const obstacles = createElements(5);
const weapons = createElements(4, [], obstacles);
const players = createElements(2, [], weapons.concat(obstacles));
createGrid(totalRows, totalCols, obstacles, weapons, players);

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Déterminer si une cellule a un obstacle
 * @param cellX
 * @param cellY
 * @param obstacles
 * @returns {boolean}
 */
function cellHasObstacle(cellX, cellY, obstacles){
    for(let i = 0; i < obstacles.length; i++){
        if(obstacles[i].x === cellX && obstacles[i].y === cellY){
            return true
        }
    }
    return false;
}

function createGrid(nbRows, nbCols, obstacles) {
    const game = document.querySelector('#game')
    let tbody = ''
    for (let x = 0; x < nbRows; x++) {
        tbody += '<tr>'
        for (let y = 0; y < nbCols; y++) {
            if(cellHasObstacle(x, y, obstacles)){
                tbody += '<td class="obstacle"></td>'
            } else {
                tbody += '<td></td>'
            }
        }
        tbody += '</tr>'
    }

    game.innerHTML = '<table><tbody>' + tbody + '</tbody></table>';
}

/**
 * Tableau de coordonnées des obstacles
 * @param nbObstacles
 * @param coordinates
 * @returns {*[]}
 */
function createObstacles(nbObstacles, coordinates = []) {
    if (coordinates.length === nbObstacles) {
        return coordinates
    }

    const coordinate = {
        x: getRandomNumber(0, 4),
        y: getRandomNumber(0, 4)
    }

    let coordinateExists = false;
    for (let j = 0; j < coordinates.length; j++) {
        if (coordinate.x === coordinates[j].x && coordinate.y === coordinates[j].y) {
            coordinateExists = true;
        }
    }

    if (!coordinateExists) {
        coordinates.push(coordinate)
    }

    return createObstacles(nbObstacles, coordinates)
}

const obstacles = createObstacles(5, [])
createGrid(5, 5, obstacles);

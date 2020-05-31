var ctx
var cols, rows;
var w = 60;
var height = 600;
var width = 600;
var grid = [];
var current;
var stack = [];

var initCell;
var imgBunny;

function setup() {
    let maze = document.getElementById('maze');
    cols = Math.floor(width / w)
    rows = Math.floor(height / w)

    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
            var cell = new Cell(i, j);
            grid.push(cell)
        }
    }

    current = grid[0];
    initCell = grid[0];
}

function draw() {

    if (maze.getContext) {
        ctx = maze.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        

        setup();

        current.visited = true;

        while (1) {
            next = current.checkNeighbours();

            if (!next) {
                if (stack.length > 0) {
                    var cell = stack.pop();
                    current = cell;
                } else {
                    break;
                }
            } else {
                //step 1
                next.visited = true;
                removeWalls(current, next);
                //step 2
                stack.push(current);
                //step 4
                current = next;
            }
        }
        for (let i = 0; i < grid.length; i++) {
            grid[i].show();
        }

        drawFood();
        drawBall(0, 0);
    } else {
        // canvas-unsupported code here
        alert(`Browser doesn't support canvas!`)
    }
}

function getIndex(i, j) {
    return (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) ? 0 : i + j * cols
}

function Cell(i, j) {

    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.show = function() {
        var x = this.i * w;
        var y = this.j * w;

        ctx.beginPath();
        //top
        if (this.walls[0]) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
        }
        //right
        if (this.walls[1]) {
            ctx.moveTo(x + w, y);
            ctx.lineTo(x + w, y + w);
        }
        //bottom
        if (this.walls[2]) {
            ctx.moveTo(x + w, y + w);
            ctx.lineTo(x, y + w);
        }
        //left
        if (this.walls[3]) {
            ctx.moveTo(x, y + w);
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        //draw small rectangles
        if (this.visited) {
            ctx.rect(x, y, w, w);
            ctx.fill();
        }
    }

    this.checkNeighbours = function() {
        var neighbours = [];

        var top = grid[getIndex(i, j - 1)];
        var right = grid[getIndex(i + 1, j)];
        var bottom = grid[getIndex(i, j + 1)];
        var left = grid[getIndex(i - 1, j)];

        if (top && !top.visited) {
            neighbours.push(top)
        }
        if (right && !right.visited) {
            neighbours.push(right)
        }
        if (bottom && !bottom.visited) {
            neighbours.push(bottom)
        }

        if (left && !left.visited) {
            neighbours.push(left)
        }
        if (neighbours.length > 0) {
            var r = Math.floor(Math.random() * (neighbours.length - 0)) + 0
            return neighbours[r]
        } else {
            return undefined;
        }

    }
}

function removeWalls(a, b) {
    let x = a.i - b.i
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    let y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function drawBall(x, y) {
    imgBunny = new Image();
    imgBunny.src = './bunny.jpg';
    imgBunny.onload = function() {
        // ctx.drawImage(imgBunny, x + w / 4, y + w / 4, w / 2, w / 2);
        ctx.drawImage(imgBunny, x, y, w - 1, w - 1);
    }
}

function drawFood() {
    let img = new Image();
    img.src = './food.jpg';
    img.onload = function() {
        ctx.drawImage(img, (cols - 1) * w, (rows - 1) * w, w, w);
    }
}

function eraseBall(x, y) {
    ctx.clearRect(x + w / 4, y + w / 4, w / 2, w / 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, w - 1, w - 1);
}

function moveSource(e) {
    var nextCell;
    var canMove;
    let dir;
    e = e || window.event;

    switch (e.keyCode) {
        case 38: // arrow up key
        case 87: // W key
            nextCell = grid[getIndex(initCell.i, initCell.j - 1)]; //top
            dir = 'top';
            break;
        case 39: // arrow right key
        case 68: // D key
            nextCell = grid[getIndex(initCell.i + 1, initCell.j)]; //right
            dir = 'right';
            break;
        case 40: // arrow down key
        case 83: // S key
            nextCell = grid[getIndex(initCell.i, initCell.j + 1)]; //bottom
            dir = 'bottom';
            break;
        case 37: // arrow left key
        case 65: // A key
            nextCell = grid[getIndex(initCell.i - 1, initCell.j)]; //left
            dir = 'left';
            break;
        default:
            return;

    }
    movingAllowed = canMoveTo(nextCell, initCell, dir);
    if (movingAllowed === 1) { // 1 means 'the rectangle can move'
        drawBall(nextCell.i * w, nextCell.j * w);
        eraseBall(initCell.i * w, initCell.j * w);
        initCell = nextCell;
    } else if (movingAllowed === 2) { // 2 means 'the rectangle reached the end point'

        let img = new Image();
        img.src = './congrats.jpg';
        img.onload = function() {
            ctx.drawImage(img, 0, 0, width, height);
        }

        window.removeEventListener("keydown", moveSource, true);
    }
}

function canMoveTo(destCell, initCell, dir) {
    let canMove = 0;
    let wallNext = destCell.walls;
    let wallCurrent = initCell.walls;

    if (destCell.i === rows - 1 && destCell.j === cols - 1) {
        canMove = 2;
    } else if ((!wallNext[2] && !wallCurrent[0] && dir === 'top') || //top
        (!wallNext[3] && !wallCurrent[1] && dir === 'right') || //right
        (!wallNext[0] && !wallCurrent[2] && dir === 'bottom') || //bottom
        (!wallNext[1] && !wallCurrent[3] && dir === 'left')) { //left
        canMove = 1;
    }
    return canMove;
}


window.addEventListener("keydown", moveSource, true);
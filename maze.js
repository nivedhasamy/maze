var ctx
var cols, rows;
var w = 50;
var height = 500;
var width = 500;
var grid = [];
var current;
var stack = [];

//movement
var sourceX = 0;
var sourceY = 0;


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

}

function draw() {

    if (maze.getContext) {
        ctx = maze.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        //ctx.fillStyle = '#fff';
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

        drawBall(sourceX,sourceY);

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
        console.trace()
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

        ctx.strokeStyle = "#fff";
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

        console.log({ neighbours })
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

function drawBall(x,y) {
    ctx.beginPath();
    ctx.arc(x+w / 2, y+w / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function eraseBall(x, y) {
     ctx.beginPath();
    ctx.arc(x+w / 2, y+w / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fill();
    ctx.closePath();

}

function moveSource(e) {

    var nextX;
    var nextY;
    var canMove;
    e = e || window.event;
//instead of source use grid[] ; next grid -> top, rt, btm, left ; canMove -> check neightbour wall
    debugger;
    switch (e.keyCode) {
        case 38: // arrow up key
        case 87: // W key
            nextX = sourceX;
            nextY = sourceY - w;
            break;
        case 37: // arrow left key
        case 65: // A key
            nextX = sourceX - w;
            nextY = sourceY;
            break;
        case 40: // arrow down key
        case 83: // S key
            nextX = sourceX;
            nextY = sourceY + w;
            break;
        case 39: // arrow right key
        case 68: // D key
            nextX = sourceX + w;
            nextY = sourceY;
            break;
        default:
            return;

    }
//movingAllowed = canMoveTo(nextX, nextY);
movingAllowed = 1;
    if (movingAllowed === 1) {      // 1 means 'the rectangle can move'
        drawBall(nextX, nextY);

eraseBall(sourceX,sourceY)
        sourceX = nextX;
        sourceY = nextY;
    }
    else if (movingAllowed === 2) { // 2 means 'the rectangle reached the end point'
       // clearInterval(intervalVar); // we'll set the timer later in this article
      //  makeWhite(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        ctx.font = "40px Arial";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Congratulations!", width / 2, height / 2);
        window.removeEventListener("keydown", moveRect, true);
    }

}


window.addEventListener("keydown", moveSource, true);
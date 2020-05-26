var ctx
var cols, rows;
var w = 40;
var height = 400;
var width = 400;
var grid = [];
var current;

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
        ctx.fillRect(0, 0, width, height);
        setup();

        current.visited = true;
       
        while (1) {
            current.show();
            next = current.checkNeighbours();

            if (!next) {
                break;
            }

            next.visited = true;
            current = next;
        }

        for (let i = 0; i < grid.length; i++) {
            grid[i].show();
        }

    } else {
        // canvas-unsupported code here
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

        //draw small rectangles
        if (this.visited) {
            // ctx.beginPath();
            ctx.rect(x, y, w - 1, w - 1);
            //ctx.closePath();
            ctx.fill()
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
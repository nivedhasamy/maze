var ctx
var cols, rows;
var w = 40;
var height = 400;
var width = 400;
var grid = [];


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

    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
}

function draw() {

    if (maze.getContext) {
        ctx = maze.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(0, 0, width, height);
        setup()

    } else {
        // canvas-unsupported code here
    }
}

function Cell(i, j) {

    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];

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
        // ctx.beginPath();
        // ctx.rect(x,y,w-1,w-1);
        // ctx.closePath();
        // ctx.fill()
    }


}
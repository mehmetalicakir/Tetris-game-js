const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = suareSize = 20;
const VACANT = "WHITE"; // Color of an empty square

//Draw a square

function drawSquare(x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// Create the board

let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
        
    }
    
}

// Draw the board
function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c,r,board[r][c]);
        }
        
    }
    
}
drawBoard();

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"Purple"],
    [I,"cyan"],
    [J,"orange"]
];

// Initiate a piece

let p = new Piece(PIECES[0][0],PIECES[0][1]);


// The Object Piece

function Piece(tetromino,color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // Control the pieces
    this.x = 3;
    this.y = 0;
}

// Draw a piece to the board

Piece.prototype.draw = function() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // Draw only occupied squares
            if(this.activeTetromino[r][c]) {
                drawSquare(this.x+c,this.y+r,this.color);
            }
        }
        
    }
}

// Undraw a piece to the board

Piece.prototype.unDraw = function() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // Draw only occupied squares
            if(this.activeTetromino[r][c]) {
                drawSquare(this.x+c,this.y+r,VACANT);
            }
        }
        
    }
}


// Move down the piece

Piece.prototype.moveDown = function() {
    this.unDraw();
    this.y++;
    this.draw();
}
let dropStart = Date.now();
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    
    requestAnimationFrame(drop);
}
drop();
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

// generate random piece

function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length) //0-6
    return new Piece(PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();


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

//Fill Function

Piece.prototype.fill = function(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // Draw only occupied squares
            if(this.activeTetromino[r][c]) {
                drawSquare(this.x+c,this.y+r,color);
            }
        }
        
    }
}

// Draw a piece to the board

Piece.prototype.draw = function() {
    this.fill(this.color);
}

// Undraw a piece to the board

Piece.prototype.unDraw = function() {
    this.fill(VACANT);
}


// Move down the piece

Piece.prototype.moveDown = function() {
    if (!this.collision(0,1,this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();  
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}

// Move right the piece

Piece.prototype.moveRight = function() {
    if (!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
    
    
}

// Move left the piece

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();}
    
}

// Rotate the piece

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    if(this.collision(0,0,nextPattern)){
        if (this.x > COL/2) {
            //It's the right wall
            kick = -1; //we need to move the piece to the left
        }else{
            //It's the left wall
            kick = 1; //we need to move the piece to the right
        }
    }

    if (!this.collision(0,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; //For be loop
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();}
    
}

// Piece Lock
Piece.prototype.lock = function(){
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // Skip the vacant square
            if(!this.activeTetromino[r][c]) {
               continue;
            }
            // Piece to lock on top = gave over
            if (this.y + r < 1) {
                alert("Game Over");
                // Stop request animation frame
                gameOver = true;
                break;
            }
            // Lock the piece
            board[this.y + r][this.x+c] = this.color;
        }
        
    }
}



//Collision Function

Piece.prototype.collision = function(x,y,piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            // if the square is empty, will skip it
            if(!piece[r][c]) {
                continue;
            }
            //cordinates of the piece after movement
            let newX = this.x+c + x;
            let newY = this.y+r + y;
            //conditions
            if (newX < 0 || newX >= COL || newY >= ROW ) {
                return true;
            }
            //skip newY < 0; board[-1] will crush our game
            if (newY < 0) {
                continue;
            }
            //check if there is a locked piece already in place
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
        
    }
    return false;
}


// Control the piece

document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
    } else if (event.keyCode == 38) {
        p.rotate();
    } else if (event.keyCode == 39) {
        p.moveRight();
    } else if(event.keyCode == 40){
        p.moveDown();
    }
}


let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
    
}
drop();
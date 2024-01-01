// import { wrapGrid } from 'animate-css-grid' // not using import syntax, ignore this. just here as reference

// npm init
// npm install animate-css-grid
// npm install browserify
// npx browserify app.js > bundle.js
// <script src="bundle.js"></script> in the html
// make sure you don't have type="module" in that script tag

// can pass a config object as the second argument of wrapGrid(), lets you define the duration, timing function, etc.
// https://github.com/aholachek/animate-css-grid?tab=readme-ov-file for reference
const animateCSSGrid = require('animate-css-grid');
const wrapGrid = animateCSSGrid.wrapGrid;

class Tile {
    i;
    j;
    value;
    game;
    hasMerged = false;
    numberOfMoves = 0;
    moveDirection = null;
    constructor(i, j, value, game) {
        this.i = i;
        this.j = j;
        this.value = value;
        this.game = game;
        this.div = document.createElement('div');
        this.div.classList.add('tile');
        this.game.htmlGrid.append(this.div);
        this.draw();
        // this.addEventListener("transitioned", function (event) {
        //     // technically the neighbor can't be removed until this is done either, but that would get weird. i guess we can just match up the animation to be delayed by the duration of the move transition
        //     // we need css variables to calculate the duration of the transition, and each transition won't be the same duration, so that doesn't work
        //     // how about when something is removed, it gets a remove or fadeout type class applied to it, and that class sets the z-index to -1, and it doesn't...hmmm
        //     this.div.classList.remove(this.div.classList.startsWith('move'));
        //     // remove and add the i and j classes to fix its new position in the grid, (and remove the move class) now that it has finished its movement transition
        //     // this will need a lot of testing, and i could imagine it breaking if you execute moves too quickly (and just in general lol). but we'll see!
        // })
    }
    remove = function () {
        this.game.tiles.splice(this.game.tiles.indexOf(this), 1);
        this.div.remove(); // may add fadeout or remove class or something like that
        delete this;
    }
    draw = function () {
        this.div.innerText = this.value;
        for (let i = this.div.classList.length - 1; i >= 0; i--) {
            if (this.div.classList[i].startsWith('color-') || this.div.classList[i].startsWith('i-') || this.div.classList[i].startsWith('j-')) {
                this.div.classList.remove(this.div.classList[i]);
            }
        }
        if (this.value <= 2048) {
            this.div.classList.add(`color-${this.value}`);
        } else {
            this.div.classList.add('color-super');
        }

        this.div.classList.add(`i-${this.i}`);
        this.div.classList.add(`j-${this.j}`);
        // if we're using the move classes (move-right-2, etc.), you would remove them here, because this wouldn't be firing until after the transition
    }
    endMove = function () {
        // if you want to try the transpose thing later, you could add this here, and don't call draw until "transitioned" fires
        // this.div.classList.add(`move-${this.moveDirection}-${this.numberOfMoves}`);
        this.draw();

        // this.numberOfMoves = 0; // only do this if it matters. for now we aren't even using these
        // this.moveDirection = null; // ditto
    }
    moveLeft = function () {
        this.moveDirection = 'left';
        let neighbor = this.neighbors['left'];
        while (neighbor !== undefined) {
            if (neighbor === null) {
                this.j -= 1;
                this.numberOfMoves += 1;
            } else if (neighbor.value === this.value && !neighbor.hasMerged && !this.hasMerged) {
                neighbor.remove();
                this.j -= 1;
                this.value *= 2;
                this.numberOfMoves += 1;
                this.hasMerged = true;
                this.game.score += this.value;
            } else {
                this.endMove();
                return;
            }
            neighbor = this.neighbors['left'];
        }
        this.endMove();
    }
    moveRight = function () {
        this.moveDirection = 'right';
        let neighbor = this.neighbors['right'];
        while (neighbor !== undefined) {
            if (neighbor === null) {
                this.j += 1;
                this.numberOfMoves += 1;
            } else if (neighbor.value === this.value && !neighbor.hasMerged && !this.hasMerged) {
                neighbor.remove();
                this.j += 1;
                this.value *= 2;
                this.numberOfMoves += 1;
                this.hasMerged = true;
                this.game.score += this.value;
            } else {
                this.endMove();
                return;
            }
            neighbor = this.neighbors['right'];
        }
        this.endMove();
    }
    moveUp = function () {
        this.moveDirection = 'up';
        let neighbor = this.neighbors['up'];
        while (neighbor !== undefined) {
            if (neighbor === null) {
                this.i -= 1;
                this.numberOfMoves += 1;
            } else if (neighbor.value === this.value && !neighbor.hasMerged && !this.hasMerged) {
                neighbor.remove();
                this.i -= 1;
                this.value *= 2;
                this.numberOfMoves += 1;
                this.hasMerged = true;
                this.game.score += this.value;
            } else {
                this.endMove();
                return;
            }
            neighbor = this.neighbors['up'];
        }
        this.endMove();
    }
    moveDown = function () {
        this.moveDirection = 'down';
        let neighbor = this.neighbors['down'];
        while (neighbor !== undefined) {
            if (neighbor === null) {
                this.i += 1;
                this.numberOfMoves += 1;
            } else if (neighbor.value === this.value && !neighbor.hasMerged && !this.hasMerged) {
                neighbor.remove();
                this.i += 1;
                this.value *= 2;
                this.numberOfMoves += 1;
                this.hasMerged = true;
                this.game.score += this.value;
            } else {
                this.endMove();
                return;
            }
            neighbor = this.neighbors['down'];
        }
        this.endMove();
    }
    get neighbors() {
        const neighbors = {};
        const grid = this.game.grid;
        const i = this.i;
        const j = this.j;
        if (j - 1 >= 0) neighbors['left'] = grid[i][j - 1];
        if (j + 1 < grid[i].length) neighbors['right'] = grid[i][j + 1];
        if (i - 1 >= 0) neighbors['up'] = grid[i - 1][j];
        if (i + 1 < grid.length) neighbors['down'] = grid[i + 1][j];
        return neighbors;
    }
    // make directional versions of this, and check to see if any tile can move before executing a move
    canMove = function () {
        // const neighbors = Object.values(this.neighbors());
        const possibleMoves = {
            'left': false,
            'right': false,
            'up': false,
            'down': false
        }
        for (let direction in this.neighbors) {
            if (this.neighbors[direction] === null || this.neighbors[direction].value === this.value) possibleMoves[direction] = true;
        }
        //     for (let neighbor of neighbors) {
        //         if (neighbor === null) return true;
        //         if (neighbor.value === this.value) return true;
        //     }
        // return false;
        if (Object.values(possibleMoves).every(value => !value)) {
            return false;
        } else {
            return possibleMoves;
        }
    }
}

class Game {
    tiles = [];
    get grid() {
        const grid = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];
        for (let tile of this.tiles) {
            grid[tile.i][tile.j] = tile;
        }
        return grid;
    }
    score = 0;
    htmlScore;
    htmlGameOver;
    htmlGrid;
    constructor() {
        this.htmlScore = document.querySelector('.score');
        this.htmlGameOver = document.querySelector('.game-over');
        this.htmlGrid = document.querySelector('.grid');
        wrapGrid(this.htmlGrid, {
            duration: 100
        });
    }
    get emptySquares() {
        const emptySquares = [];
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === null) emptySquares.push({ i: i, j: j });
            }
        }
        return emptySquares;
    }
    get randomEmptySquare() {
        const randomIndex = Math.floor(Math.random() * this.emptySquares.length)
        return this.emptySquares[randomIndex];
    }
    addRandomTile = function () {
        const emptySquare = this.randomEmptySquare;
        if (emptySquare) {
            if (Math.random() < 0.9) {
                this.tiles.push(new Tile(emptySquare.i, emptySquare.j, 2, this));
            } else {
                this.tiles.push(new Tile(emptySquare.i, emptySquare.j, 4, this));
            }
            return true;
        } else {
            return false;
        }
    }
    isOver = function () {
        // be aware: if there are no tiles, this will say the game is over. that shouldn't be possible, but just something to be aware of
        return this.tiles.every(tile => !tile.canMove());
    }
    update = function () {
        // do i want to call all tile.update()s here?
        this.htmlScore.innerText = `Score: ${this.score}`;
        if (this.isOver()) {
            this.htmlGameOver.classList.remove('hidden');
            // stop arrow input? doesn't really matter, because it can't do anything, but makes sense
            // can add that to the arrow handlers i guess, if game.isOver, preventDefault, or stop bubbling (no, not that one), whatever
            // turn the gameover message into a popup that gives you a button to start over or something
            // maybe always new game button, but the game over message pops up over the board and greys it out, just like the real one. but don't care too much about this
        }

    }
    // could exclude 1 row/column from the looping on these, since we know the direction-most row/column can't move
    // may come back and do that, but for now i'm curious if the tile move logic handles those undefined neighbors correctly
    moveLeft = function () {
        // check if any tile can move left. if none can, return early
        if (this.tiles.every(tile => !tile.canMove().left)) return;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j]) this.grid[i][j].moveLeft();
            }
        }
        for (let tile of this.tiles) tile.hasMerged = false; // have to wait until after all tiles have moved before resetting merge status
        this.addRandomTile();
        this.update();
    }
    moveRight = function () {
        if (this.tiles.every(tile => !tile.canMove().right)) return;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = this.grid[i].length - 1; j >= 0; j--) {
                if (this.grid[i][j]) this.grid[i][j].moveRight();
            }
        }
        for (let tile of this.tiles) tile.hasMerged = false;
        this.addRandomTile();
        this.update();
    }
    moveUp = function () {
        if (this.tiles.every(tile => !tile.canMove().up)) return;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j]) this.grid[i][j].moveUp();
            }
        }
        for (let tile of this.tiles) tile.hasMerged = false;
        this.addRandomTile();
        this.update();
    }
    moveDown = function () {
        if (this.tiles.every(tile => !tile.canMove().down)) return;
        for (let i = this.grid.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j]) this.grid[i][j].moveDown();
            }
        }
        for (let i = this.tiles.length - 1; i >= 0; i--) this.tiles[i].moveDown(); // backward
        for (let tile of this.tiles) tile.hasMerged = false;
        this.addRandomTile();
        this.update();
    }
}


const game = new Game();
game.addRandomTile();
game.addRandomTile();
game.update();

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
        case 'ArrowUp':
            game.moveUp();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;

        default:
            break;
    }
})
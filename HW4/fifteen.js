/*  CSE 154 Homework 4: Fifteen Puzzle
    Anastasia Erofeeva
    04/27/2017
    Section: AH
    TA: Melissa Medsker
    This is a JavaScript file for the "Fifteen Puzzle" page */

// Module pattern and use strict.    
(function () {
    "use strict";
    
    // Function to reduce typing for 'document.getElementById'.
    var $ = function(id) {
        return document.getElementById(id);
    };
    
    // Global variable for the empty square's row.
    var emptyRow = 3;
    
    // Global variable for the empty square's column.
    var emptyColumn = 3;
    
    // Constant for the number of rows/columns in the puzzle.
    var ROWS_COLUMNS = 4;
    
    // Constant for the width/height of each puzzle piece.
    var WIDTH_HEIGHT = 100;
    
    // Function that calls another function to build the puzzle, which is 
    // made out of fifteen squares. 
    window.onload = function() {
        for (var i = 0; i < ((ROWS_COLUMNS * ROWS_COLUMNS) - 1); i++) {
            var piece = addPuzzlePiece(Math.floor(i / ROWS_COLUMNS), (i % ROWS_COLUMNS));
            var number = document.createElement("span");
            number.innerHTML = i + 1;
            piece.appendChild(number);
            $("puzzlearea").appendChild(piece);
        }
        
        // Calls a function to check if a square can be moved.
        callCanMove();
        
        // Calls a function when the shuffle button is clicked.
        $("shufflebutton").onclick = shuffle;
    };
    
    // Function that takes a row and a column and adds a puzzle piece at that 
    // row and column. It also gives the puzzle piece an id and sets the 
    // coordinates for which part of the background image is shown in the 
    // puzzle piece.
    function addPuzzlePiece(row, column) {
        var puzzlePiece = document.createElement("div");
        puzzlePiece.classList.add("square");
        puzzlePiece.setAttribute("id", "square_" + row + "_" + column);
        puzzlePiece.style.left = coordinates(column);
        puzzlePiece.style.top = coordinates(row);
        puzzlePiece.style.backgroundPosition = coordinates(-column) + " " + coordinates(-row);
        return puzzlePiece;
    }
    
    // Function that takes a row and a column, find the square at that row and 
    // column, and checks if it neighbors the empty square. If it does, the 
    // 'movable' class is added to the square and the function to move the 
    // puzzle piece is called.
    function canMove(x, y) {
        var tile = $("square_" + y + "_" + x);
        tile.classList.remove("movable");
        if ((x == emptyColumn && (Math.abs(y - emptyRow)) == 1) || 
            (y == emptyRow && (Math.abs(x - emptyColumn)) == 1)) {
            tile.classList.add("movable");
            tile.onclick = function() {
                movePuzzlePiece(this);
            };
        }
    }
    
    // Function that moves a puzzle piece when it is clicked, if the puzzle
    // piece is movable. 
    function movePuzzlePiece(tile) {
        var x = getColumn(tile);
        var y = getRow(tile);
        if (tile.classList.contains("movable")) {
            tile.style.left = coordinates(emptyColumn);
            tile.style.top = coordinates(emptyRow);
            tile.setAttribute("id", "square_" + getRow(tile) + "_" + getColumn(tile));
            emptyColumn = x;
            emptyRow = y;
            callCanMove();
        }
    }
    
    // Function that shuffles the puzzle pieces when the shuffle button is clicked. 
    function shuffle() {
        for (var i = 0; i < 1000; i++) {
            var neighbors = [];
            var movableNeighbors = document.querySelectorAll(".square");
            for (var j = 0; j < movableNeighbors.length; j++) {
                canMove(getColumn(movableNeighbors[j]), getRow(movableNeighbors[j]));
                if (movableNeighbors[j].classList.contains("movable")) {
                    neighbors.push(movableNeighbors[j]);
                }
            }
            var random = neighbors[Math.floor(Math.random() * neighbors.length)];
            movePuzzlePiece(random);
        }
    }
    
    // Function that calls the 'canMove' function to check if a square can be moved.
    function callCanMove() {
        var tiles = document.querySelectorAll(".square");
        for (var i = 0; i < tiles.length; i++) {
            canMove(getColumn(tiles[i]), getRow(tiles[i]));
        }
    }
    
    // Function that takes a row or column and returns that square's top or left coordinate. 
    function coordinates(rowOrColumn) {
        return ((rowOrColumn * WIDTH_HEIGHT) + "px");
    }
    
    // Function that takes a square and return the square's column.
    function getColumn(tile) {
        return (parseInt(tile.style.left, 10) / WIDTH_HEIGHT);
    }
    
    // Function that takes a square and returns the square's row.
    function getRow(tile) {
        return (parseInt(tile.style.top, 10) / WIDTH_HEIGHT);
    }
    
})();
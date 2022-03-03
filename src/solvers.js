/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = new Board({n: n});

  for (let index = 0; index < n; index++) {
    if (index === n) {
      break;
    }
    solution.togglePiece(index, index);
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var solutionBoard = new Board({n: n});

  var findSolutions = function (rowIndex) {
    var rowIndex = rowIndex || 0; //each row can only have 1 piece, so rowIndex represents # of pieces

    if (rowIndex === n) { //Have I reached the max # of pieces on the board?
      solutionCount++;
      return;
    }

    for (let colIndex = 0; colIndex < n; colIndex++) { //iterates through columns
      solutionBoard.togglePiece(rowIndex, colIndex); //add piece

      if (!solutionBoard.hasAnyRooksConflicts()) { //if the new piece doesnt cause conflicts,
        findSolutions(rowIndex + 1); //then go to the next row, which will keep adding pieces until we reach n
      }
      solutionBoard.togglePiece(rowIndex, colIndex); //remove piece
    }
  };
  findSolutions();

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solutionBoard = new Board({n: n});
  if (n === 2 || n === 3) {
    return solutionBoard.rows();
  }
  var solution;
  var solutionFound = false;
  var findSolution = function (rowIndex) {
    var rowIndex = rowIndex || 0;
    if (rowIndex === n) {
      solution = solutionBoard.rows();
      solutionFound = true;
      return;
    }
    for (let colIndex = 0; colIndex < n; colIndex++) {
      solutionBoard.togglePiece(rowIndex, colIndex);
      if (!solutionBoard.hasAnyQueensConflicts()) {
        findSolution(rowIndex + 1);
      }
      if (solutionFound) {
        return;
      }
      solutionBoard.togglePiece(rowIndex, colIndex);
    }
  };
  findSolution();
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

//return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  if (n === 2 || n === 3) {
    return 0;
  }
  var solutionBoard = new Board({n: n});

  var findSolutions = function (rowIndex) {
    var rowIndex = rowIndex || 0; //each row can only have 1 piece, so rowIndex represents # of pieces

    if (rowIndex === n) { //Have I reached the max # of pieces on the board?
      solutionCount++;
      return;
    }

    for (let colIndex = 0; colIndex < n; colIndex++) { //iterates through columns
      solutionBoard.togglePiece(rowIndex, colIndex); //add piece

      if (!solutionBoard.hasAnyQueensConflicts()) { //if the new piece doesnt cause conflicts,
        findSolutions(rowIndex + 1); //then go to the next row, which will keep adding pieces until we reach n
      }
      solutionBoard.togglePiece(rowIndex, colIndex); //remove piece
    }
  };
  findSolutions();

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

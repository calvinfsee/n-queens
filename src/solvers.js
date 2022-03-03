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
    solution.togglePiece(index, index);
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {

  return n > 1 ? n * window.countNRooksSolutions(n - 1) : 1; //cheeky factorial solution

  var solutionCount = 0;
  var solutionBoard = new Board({n: n});

  var findSolutions = function (rowIndex) { //Tree solution, each iteration of findSolutions creates a new branch
    var rowIndex = rowIndex || 0; //each row can only have 1 piece, so rowIndex represents # of pieces

    if (rowIndex === n) { //Have I reached the max # of pieces on the board?
      solutionCount++;
      return;
    }

    for (let colIndex = 0; colIndex < n; colIndex++) { //iterates through column
      solutionBoard.togglePiece(rowIndex, colIndex); //add piece

      if (!solutionBoard.hasAnyRooksConflicts()) { //if the new piece doesnt cause conflicts,
        findSolutions(rowIndex + 1); //then create a new branch
      }
      solutionBoard.togglePiece(rowIndex, colIndex); //removes piece when you have tried all possible variations of this branch
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
  var solution = false;

  var findSolution = function (rowIndex) {
    if (rowIndex === n || solution) {
      solution = true;
      return;
    }
    var rowIndex = rowIndex || 0;

    for (let colIndex = 0; colIndex < n; colIndex++) {
      solutionBoard.togglePiece(rowIndex, colIndex);
      if (!solutionBoard.hasAnyQueensConflicts()) {
        findSolution(rowIndex + 1);
      }
      if (solution) { //if a solution has been found, exit the recursive method
        return;
      } else {
        solutionBoard.togglePiece(rowIndex, colIndex);
      }
    }
  };
  findSolution();
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solutionBoard.rows();
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
        findSolutions(rowIndex + 1); //then create a new branch and iterate through all variations
      }
      solutionBoard.togglePiece(rowIndex, colIndex); //remove piece
    }
  };
  findSolutions();

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

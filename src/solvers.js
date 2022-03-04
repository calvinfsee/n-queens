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
  var solution = new Board({n: n}); //fixme
  console.log(solution);

  for (let index = 0; index < solution.attributes.n; index++) { //places n rooks on the first major diagonal
    solution.togglePiece(index, index); // rooks on a major diagonal will always work
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  return n > 1 ? n * window.countNRooksSolutions(n - 1) : 1;

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution; //fixme
  var solutionBoard = new Board({n: n});
  if (n === 2 || n === 3) {
    return solutionBoard.rows();
  }

  //Interpretation: need to return a solution board

  //Input - n
  //Output - board with valid queen positions
  //Constraints - none
  //Edgecases - 0, 2 and 3

  //strategy
  //within our for loop have an if (solution) === if solution is defined
  //note: kind of copied countNQueens

  //Psuedocode
  //if 0, 2, or 3.
  //return empty array

  //make solution

  let queenHelper = function (row = 0) {
    if (row === n) { //row is equivalent to number of queens
      solution = solutionBoard.rows();
      return;
    }
    for (let col = 0; col < n; col++) {
      solutionBoard.togglePiece(row, col); //we place a queen
      if (!solutionBoard.hasAnyQueensConflicts()) { //the requirement for a recursive call is no conflicts on the board
        queenHelper(row + 1);
      }
      if (solution) {
        return;
      }
      solutionBoard.togglePiece(row, col);
    }
  };
  queenHelper();


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
  if (n === 2 || n === 3) {
    return 0;
  }
  var solutionCount = 0;
  var solutionBoard = new Board({n: n});


  //input: n
  //output: an integer representing the total possible variations for having n queens on an n x n board
  //constraints: time ?
  //edge cases: 2 and 3

  //Helperfunc
  //base case:
  //to keep recursing:

  //Psuedocode
  //create helperfunction with param of row
  //and a for loop that iterates through the column index
  //for each recursive call of the function, we test every possible column for conflicts
  //When we find a column where we can place a queen with no conflicts, we recursively call the function with row + 1
  //essentially taking us to the next row, where we iterate through the columns and try to find another column index on the new row with no conflicts
  let queenHelper = function (row = 0) {
    if (row === n) { //row is equivalent to number of queens
      solutionCount++;
      return;
    }
    for (let col = 0; col < n; col++) {
      solutionBoard.togglePiece(row, col); //we place a queen
      if (!solutionBoard.hasAnyQueensConflicts()) { //the requirement for a recursive call is no conflicts on the board
        queenHelper(row + 1);
      }
      solutionBoard.togglePiece(row, col);
    }
  };
  queenHelper();

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
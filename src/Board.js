// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)
(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      return _.reduce(this.attributes[rowIndex], (x, y) => x + y, 0) > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function(rowIndex) {
      var rowIndex = rowIndex || 0;
      if (this.hasRowConflictAt(rowIndex)) {
        return true;
      }
      return rowIndex < this.attributes.n ? //If within confines of the board
        this.hasAnyRowConflicts(rowIndex + 1) : false; //
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      return _.reduce(this.rows(), (x, y) => x + y[colIndex], 0) > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function(colIndex) {
      var colIndex = colIndex || 0;

      if (this.hasColConflictAt(colIndex)) {
        return true;
      }
      return colIndex + 1 < this.attributes.n ?
        this.hasAnyColConflicts(colIndex + 1) : false;
    },
    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict

    sumMajor: function (col, row) { //Adds a diagonal together
      var row = row || 0; //if row is undefined, set to 0

      return col < this.attributes.n ? //if col is within bounds of array
        this.attributes[col][row] + this.sumMajor(col + 1, row + 1) : 0; //return sum of diagonal
    },

    hasMajorDiagonalConflictAt: function(colIndex, rowIndex) {
      return this.sumMajor(colIndex, rowIndex) > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (let colIndex = 0; colIndex < this.attributes.n; colIndex++) {
        if (this.hasMajorDiagonalConflictAt(colIndex)) {
          return true;
        }
      }
      for (let rowIndex = 0; rowIndex < this.attributes.n; rowIndex++) {
        if (this.hasMajorDiagonalConflictAt(0, rowIndex)) {
          return true;
        }
      }
      return false;
    },

    // 1 0 0
    // 0 1 0
    // 0 0 0

    //0 0 0
    //1 0 0
    //0 1 0



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    sumMinor: function (col, row) {
      var row = row || 0; //if row is undefined, set to 0

      if (col > 0 || row > this.attributes.n) {
        return 0;
      }
      console.log('line 165:', col, row)
      return this.attributes[row][col] + this.sumMinor(col - 1, row + 1);
    },

    hasMinorDiagonalConflictAt: function(colIndex, rowIndex) {
      return this.sumMinor(colIndex, rowIndex) > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (let colIndex = 1; colIndex < this.attributes.n; colIndex++) {
        if (this.hasMinorDiagonalConflictAt(colIndex)) {
          return true;
        }
      }
      for (let rowIndex = 0; rowIndex < this.attributes.n; rowIndex++) {
        if (this.hasMinorDiagonalConflictAt(this.attributes.n - 1, rowIndex)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

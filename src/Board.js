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
      let conflict = this.hasRowConflictAt(rowIndex) || false;

      return rowIndex + 1 < this.attributes.n && !conflict ? //If within confines of array and no conflict has been found
        this.hasAnyRowConflicts(rowIndex + 1) : conflict; //check next row or return rowConflict and exit method
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
      let conflict = this.hasColConflictAt(colIndex) || false;

      return colIndex + 1 < this.attributes.n && !conflict ?
        this.hasAnyColConflicts(colIndex + 1) : conflict;
    },
    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict

    sumMajor: function (row, col) { //Adds a major diagonal
      return row < this.attributes.n && col < this.attributes.n ? //If row and col are less than array length
        this.attributes[row][col] + this.sumMajor(row + 1, col + 1) : 0; //recursively add OR return 0 to exit program
    },

    hasMajorDiagonalConflictAt: function(index) {
      return index > 0 ?
        this.sumMajor(0, index) > 1 : this.sumMajor(index * -1, 0) > 1;
    },

    hasAnyMajorDiagonalConflicts: function() {
      for (let index = this.attributes.n * -1 + 2; index < this.attributes.n - 2; index++) { //no conflicts at last column or row
        if (this.hasMajorDiagonalConflictAt(index)) {
          return true;
        }
      }
      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    sumMinor: function (row, col) { //adds minor diagonals
      return row < this.attributes.n && col > -1 ? //If within confines of array
        this.attributes[row][col] + this.sumMinor(row + 1, col - 1) : 0; //recursively add OR return 0 and exit method
    },
    hasMinorDiagonalConflictAt: function(index) {
      return index < this.attributes.n ?
        this.sumMinor(0, index) > 1 : this.sumMinor(index - this.attributes.n + 1, this.attributes.n - 1) > 1;
    },

    hasAnyMinorDiagonalConflicts: function() {
      for (let index = 1; index < (this.attributes.n * 2 - 2); index++) { //no conflicts at index 0
        if (this.hasMinorDiagonalConflictAt(index)) {
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

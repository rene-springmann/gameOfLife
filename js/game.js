(function ($) {

    /**
     * Namespace.
     */
    window.game = window.game || {};

    game.dimensions = {x : 60, y : 40};
    game.playground = null;
    game.cells = {};
    game.debug = false;
    game.startLifePercentage = 30.00;
    game.livingCells = 0;
    game.stepCounter = 0;
    game.interval = null;

    game.init = function(playground){
        this.playground = playground;

        this.drawPlayground();
        this.fillWithRandom();
        this.refreshPlayground();

        $('#single-step-button').click(function(){
            game.evolve();
        });

        $('#start-button').click(function(){
            game.start();
        });

        $('#stop-button').click(function(){
            game.stop();
        }).addClass('disabled');
    };

    game.drawPlayground = function(){
        for (var y = 0; y < this.dimensions.y; y++) {
            var rowElement = $('<div>', {class: 'playground-row'});
            this.playground.append(rowElement);
            var row = $(rowElement);
            row.data('row-id', y);
            this.cells[y] = {};
            for (var x = 0; x < this.dimensions.x; x++) {
                var cellElement = $('<div>', {class: 'playground-cell', id: 'cell-' + y + '-' + x});
                row.append(cellElement);
                var cell = $(cellElement);
                cell.data('row-id', y).data('cell-id', x).data('alive', false);
                if(this.debug) cell.html(x + '-' + y);
                this.cells[y][x]= false;
            }
        }
        //console.debug(this.cells);
    };

    game.refreshPlayground = function(){
        for (var y = 0; y < this.dimensions.y; y++) {
            for (var x = 0; x < this.dimensions.x; x++) {
                if (this.cells[y][x]) {
                    this.playground.find('#cell-' + y + '-' + x).addClass('alive', 500, 'easeInOutQuart');
                }
                else {
                    this.playground.find('#cell-' + y + '-' + x).removeClass('alive');
                }
            }
        }
        $('#living-cells-display').html(this.livingCells);
        $('#step-display').html(this.stepCounter);
    };

    game.fillWithRandom = function(){
        var numOfCells = this.dimensions.x * this.dimensions.y;
        var startCells = ( numOfCells / 100 ) * this.startLifePercentage;
        var i = 0;

        this.livingCells = startCells;

        while ( i < startCells) {
            var randX = Math.floor((Math.random() * this.dimensions.x));
            var randY = Math.floor((Math.random() * this.dimensions.y));
            if( this.cells[randY][randX] !== true) {
                this.cells[randY][randX] = true;
                i++;
            }
        }
    };

    game.evolve = function(){
        console.debug('evolve');
        var newCells = this.cells;
        var livingCells= 0;

        for (var y = 0; y < this.dimensions.y; y++) {
            for (var x = 0; x < this.dimensions.x; x++) {
                var livingNeighbours = 0;

                // left top
                if(x > 0 && y > 0 && this.cells[y - 1][x - 1]) { livingNeighbours ++; }
                // top
                if( y > 0 && this.cells[y - 1][x]) { livingNeighbours ++; }
                // right top
                if( (x + 1) < this.dimensions.x && y > 0 && this.cells[y - 1][x + 1]) { livingNeighbours ++; }
                // left
                if( x > 0 && this.cells[y][x - 1]) { livingNeighbours ++; }
                // right
                if( (x + 1) < this.dimensions.x && this.cells[y][x + 1]){ livingNeighbours ++; }
                // left bottom
                if( x > 0 && (y + 1) < this.dimensions.y && this.cells[y + 1][x - 1]){ livingNeighbours ++; }
                // bottom
                if( (y + 1) < this.dimensions.y && this.cells[y + 1][x]){ livingNeighbours ++; }
                // right bottom
                if( (y + 1) < this.dimensions.y && (x + 1) < this.dimensions.x && this.cells[y + 1][x + 1]){ livingNeighbours ++; }

                if(this.debug) {
                    var cell = this.playground.find('#cell-' + y + '-' + x);
                    cell.html(cell.html() + '<br><b>' + livingNeighbours + '</b>');
                }

                if(livingNeighbours < 2) { // a cell with less then 2 neighbours dies of loneliness
                    newCells[y][x]= false;
                }
                else if(livingNeighbours == 2 && this.cells[y][x]) { // a living cell with 2 neighbours stays alive
                    newCells[y][x]= true;
                    livingCells++;
                }
                else if(livingNeighbours == 3) { // a cell with 3 neighbours stays alive or is born
                    newCells[y][x]= true;
                    livingCells++;
                }
                else if(livingNeighbours > 3) { // a cell with more than 3 neighbors dies of overpopulation
                    newCells[y][x]= false;
                }

            }
        }
        this.cells = newCells;
        this.livingCells = livingCells;
        this.stepCounter ++;
        this.refreshPlayground();
    };

    game.start = function(){

        $('#start-button').addClass('disabled');
        $('#single-step-button').addClass('disabled');

        if (!this.interval) {
            this.interval = setInterval(function() {
                if (game.livingCells > 0) {
                    game.evolve();
                }
                else {
                    game.stop();
                }
            }, 2000);
        }
    };

    game.stop = function(){

    };


})(jQuery);
(function ($) {

    /**
     * Namespace.
     */
    window.game = window.game || {};

    game.dimensions = {x : 30, y : 30};
    game.playground = null;
    game.cells = {};
    game.debug = false;

    game.init = function(playground){
        this.playground = playground;
        this.drawPlayground();
    };

    game.drawPlayground = function(){
        for (y = 0; y < this.dimensions.y; y++) {
            var rowElement = $('<div>', {class: 'playground-row'});
            this.playground.append(rowElement);
            var row = $(rowElement);
            row.data('row-id', y);
            this.cells[y] = {};
            for (x = 0; x < this.dimensions.x; x++) {
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
        this.cells[7][9]= true;
        this.cells[25][10]= true;
        this.cells[13][10]= true;
        this.cells[2][23]= true;
        for (y = 0; y < this.dimensions.y; y++) {
            for (x = 0; x < this.dimensions.x; x++) {
                if (this.cells[y][x]) {
                    this.playground.find('#cell-' + y + '-' + x).addClass('alive', 400, 'easeInOutQuart');
                }
                else {
                    this.playground.find('#cell-' + y + '-' + x).removeClass('alive');
                }
            }
        }
    };

})(jQuery);
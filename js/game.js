(function ($) {

    /**
     * Namespace.
     */
    window.game = window.game || {};

    game.dimensions = {x : 30, y:30};
    game.playground = null;

    game.init = function(playground){
        this.playground = playground;
        this.drawPlayground();
    };

    game.drawPlayground = function(){
        for (y = 0; y < this.dimensions.y; y++) {
            var row = document.createElement("DIV");
            console.debug(row);
            row.className('playground-row').data('row-id', y);
            for (x = 0; x < this.dimensions.x; x++) {
                //row.appendCh('<div class="playground-cell">'  + (x) + '-' + (y) +  '</div>');
            }
            this.playground.append(row);
        }
    };

})(jQuery);
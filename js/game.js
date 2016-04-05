(function ($) {

    /**
     * Namespace.
     */
    window.game = window.game || {};


    game.worker     = null;
    game.playground = null;
    game.status     = {
        livingCells : 0,
        stepCounter : 0,
        running     : false,
        startTime   : null,
        cells       : {}
    };
    game.settings   = {
        dimensions          : {
            x : 20,
            y : 20
        },
        debug               : false,
        startLifePercentage : 30.00,
        interval            : 1000
    };

    game.init = function(playground){

        // Webworker
        this.worker = new Worker('js/worker.js');
        this.worker.addEventListener('message', this.handleWorkerMessage, false);
        this.sendWorkerCommand({
            cmd         : 'gameSettings',
            settings    : this.settings
        });

        this.playground = playground;

        //Initiate buttons
        $('#single-step-button').click(function(){
            game.sendWorkerCommand({
                cmd : 'single'
            });
        });

        $('#start-button').click(function(){
            game.start();
        });

        $('#stop-button').click(function(){
            game.sendWorkerCommand({
                cmd : 'stop'
            });
        }).addClass('disabled');

        //intiate playground
         this.drawPlayground();

    };

    game.start = function () {
        if (jQuery.isEmptyObject(game.status.cells)) {
            this.fillWithRandom();
            this.refreshPlayground();
        }

        game.sendWorkerCommand({
            cmd : 'start'
        });
    };

    game.handleWorkerMessage = function(e){
        var data = e.data;
        if (game.settings.debug) {
            console.log(data);
        }
        
        if (typeof(data.msg) === 'undefined') {
            return false;
        }
        switch (data.msg) {
            case 'started' :
                game.started();
                break;
            case 'stopped' :
                game.stoped();
                break;
            case 'status' :
                game.status = data.status;
                game.refreshPlayground();
                break;
        }
    };

    /**
     * Needs to be object with at least the 'cmd' property
     *
     * @param command
     * @return boolean
     */
    game.sendWorkerCommand = function(command){
        if (typeof(command.cmd) === 'undefined') {
            return false;
        }
        this.worker.postMessage(command);
    };

    game.drawPlayground = function(){
        for (var y = 0; y < this.settings.dimensions.y; y++) {
            var rowElement = $('<div>', {class: 'playground-row'});
            this.playground.append(rowElement);
            var row = $(rowElement);
            row.data('row-id', y);
            this.status.cells[y] = {};
            for (var x = 0; x < this.settings.dimensions.x; x++) {
                var cellElement = $('<div>', {class: 'playground-cell', id: 'cell-' + y + '-' + x});
                row.append(cellElement);
                var cell = $(cellElement);
                cell.data('row-id', y).data('cell-id', x).data('alive', false);
                if (this.settings.debug) {
                    cell.html(x + '-' + y);
                }
                this.status.cells[y][x]= false;
                //todo: avoid cells beeing filled on first rendering of the playground
            }
        }
        //console.debug(this.cells);
    };

    game.refreshPlayground = function(){
        for (var y = 0; y < this.settings.dimensions.y; y++) {
            for (var x = 0; x < this.settings.dimensions.x; x++) {
                if (this.status.cells[y][x]) {
                    this.playground.find('#cell-' + y + '-' + x).addClass('alive', 500, 'easeInOutQuart');
                }
                else {
                    this.playground.find('#cell-' + y + '-' + x).removeClass('alive');
                }
            }
        }
        $('#living-cells-display').html(this.status.livingCells);
        $('#step-display').html(this.status.stepCounter);
    };

    game.fillWithRandom = function(){
        var numOfCells = this.settings.dimensions.x * this.settings.dimensions.y;
        var startCells = ( numOfCells / 100 ) * this.settings.startLifePercentage;
        var i = 0;

        this.status.livingCells = startCells;

        while ( i < startCells) {
            var randX = Math.floor((Math.random() * this.settings.dimensions.x));
            var randY = Math.floor((Math.random() * this.settings.dimensions.y));
            if( this.status.cells[randY][randX] !== true) {
                this.status.cells[randY][randX] = true;
                i++;
            }
        }

        this.sendWorkerCommand({
            cmd     : 'updateStatus',
            status  : this.status
        });
    };

    game.started = function(){
        $('#start-button').addClass('disabled');
        $('#single-step-button').addClass('disabled');
        $('#stop-button').removeClass('disabled');
        $('#runtime').data('starttime', moment());
        // this.running = true;
        // this.startTime = new Date().getTime();
        // setTimeout(this.evolve, 0);
    };

    game.stoped = function(){
        $('#start-button').removeClass('disabled');
        $('#single-step-button').removeClass('disabled');
        $('#stop-button').addClass('disabled');
        $('#runtime').data('starttime', '');
    };


})(jQuery);
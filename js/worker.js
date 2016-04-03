self.gameSettings   = {};
self.gameStatus     = {};

self.addEventListener('message', function(e) {
    var data = e.data;
    console.debug(data);
    if (typeof(data.cmd) === 'undefined') {
        return false;
    }
    switch (data.cmd) {
        case 'gameSettings':
            self.gameSettings = data.settings;
            break;
        case 'updateStatus':
            self.gameStatus = data.status;
            break;
         case 'start':
             self.start();
             break;
        // Example methods
        // case 'start':
        //     self.postMessage('WORKER STARTED: ' + data.msg);
        //     break;
        // case 'stop':
        //     self.postMessage('WORKER STOPPED: ' + data.msg + '. (buttons will no longer work)');
        //     self.close(); // Terminates the worker.
        //     break;
        default:
            console.log('Unknown command: ' + data.msg);
    };
}, false);

self.start = function() {
    if (self.gameSettings.debug) {
        console.log('Game Started');
    }
    self.gameStatus.running     = true;
    self.gameStatus.startTime   = new Date().getTime();
    setTimeout(self.evolve, 0);

    self.postMessage({
        msg     : 'status',
        status  : self.gameStatus
    });
    self.postMessage({
        msg : 'started'
    });
};

self.evolve = function(){
    console.debug('evolve');
    var newCells = self.gameStatus.cells;
    var livingCells = 0;

    for (var y = 0; y < self.gameSettings.dimensions.y; y++) {
        for (var x = 0; x < self.gameSettings.dimensions.x; x++) {
            var livingNeighbours = 0;

            // left top
            if(x > 0 && y > 0 && self.gameStatus.cells[y - 1][x - 1]) { livingNeighbours ++; }
            // top
            if( y > 0 && self.gameStatus.cells[y - 1][x]) { livingNeighbours ++; }
            // right top
            if( (x + 1) < self.gameSettings.dimensions.x && y > 0 && self.gameStatus.cells[y - 1][x + 1]) { livingNeighbours ++; }
            // left
            if( x > 0 && self.gameStatus.cells[y][x - 1]) { livingNeighbours ++; }
            // right
            if( (x + 1) < self.gameSettings.dimensions.x && self.gameStatus.cells[y][x + 1]){ livingNeighbours ++; }
            // left bottom
            if( x > 0 && (y + 1) < self.gameSettings.dimensions.y && self.gameStatus.cells[y + 1][x - 1]){ livingNeighbours ++; }
            // bottom
            if( (y + 1) < self.gameSettings.dimensions.y && self.gameStatus.cells[y + 1][x]){ livingNeighbours ++; }
            // right bottom
            if( (y + 1) < self.gameSettings.dimensions.y && (x + 1) <  self.gameSettings.dimensions.x && self.gameStatus.cells[y + 1][x + 1]){ livingNeighbours ++; }

            if(livingNeighbours < 2) { // a cell with less then 2 neighbours dies of loneliness
                newCells[y][x]= false;
            }
            else if(livingNeighbours == 2 && self.gameSettings.cells[y][x]) { // a living cell with 2 neighbours stays alive
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

    self.gameStatus.cells = newCells;
    self.gameStatus.livingCells = livingCells;
    self.gameStatus.stepCounter ++;
    // game.refreshPlayground();

    if (livingCells == 0 || !self.gameStatus.running) {
        self.postMessage({
            msg : 'stopped'
        });
    }
    else {
        setTimeout(self.evolve, 0);
    }
};

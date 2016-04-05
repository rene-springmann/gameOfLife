$( document ).ready(function() {
    game.init($('#playground'));

    setInterval(function () {
        renderTime();
    }, 1000);

});

/**
 * Renders the elapsed time in all renderTime elements with the moment.js plugin.
 */
function renderTime()
{
    $('.renderTime').each(function(index, elem){
        var starttime = $(elem).data('starttime');
        if (!starttime) {
            $(elem).html('');
            return;
        }
        var sec = moment().diff(starttime, 'seconds');
        var timeString =
            ('0' + Math.floor(sec/3600) % 24).substr(-2) + ':' +
            ('0' + Math.floor(sec/60) % 60).substr(-2) + ':' +
            ('0' + (sec%60)).substr(-2);
        $(elem).html(timeString);
    });
}
// Attr name bound to each midi-player to track if player is currently at the end
// of the loop. 
// This is a workaround for https://github.com/cifkao/html-midi-player/issues/23
const HAS_FINISHED = "has_finished";

$(document).ready(function() {
    $("midi-player").on("start", function(evt) {
        // Reset the scroll if we click start and the player has finished.
        if ($(this).data(HAS_FINISHED)) {
            visualizer_class_name = $(this).attr('visualizer');
            notes_el = $(`midi-visualizer${visualizer_class_name} .waterfall-visualizer .waterfall-notes-container`);
            notes_el.scrollTop(notes_el[0].scrollHeight);
            $(this).data(HAS_FINISHED, false);
        }
    });

    $("midi-player").on("stop", function(evt) {
        if (evt.originalEvent.detail.finished) {
            $(this).data(HAS_FINISHED, true);
        }
    });
});

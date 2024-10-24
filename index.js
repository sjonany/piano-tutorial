$(document).ready(function() {
    $("midi-player").on("start", function() {
        $(".waterfall-notes-container").each(function() {
            $(this).scrollTop($(this)[0].scrollHeight);
        });
    });
});

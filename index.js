// Attr name bound to each midi-player to track if player is currently at the end
// of the loop. 
// This is a workaround for https://github.com/cifkao/html-midi-player/issues/23
const HAS_FINISHED = "has_finished";
// The total number of pages.
const NUM_PAGES = 4;

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

/* Handles pagination logic w/ alpine-js. */
function pagination() {
    return {
        currentPage: 1,
        totalPages: NUM_PAGES,

        init() {
            // Get the page number from the URL, or default to the first page.
            const urlParams = new URLSearchParams(window.location.search);
            const page = parseInt(urlParams.get('page'));
            this.currentPage = this.isValidPage(page) ? page : 1;
        },

        changePage(newPage) {
            if (!this.isValidPage(newPage)) {
                return;
            }
            
            this.currentPage = newPage;
            const newUrl = `${window.location.pathname}?page=${newPage}`;
            // Change the URL as well so user can bookmark.
            history.pushState({}, '', newUrl);
        },

        handleKeydown(event) {
            if (event.key === 'ArrowLeft') {
              this.changePage(this.currentPage - 1);
            } else if (event.key === 'ArrowRight') {
              this.changePage(this.currentPage + 1);
            }
        },

        isValidPage(page) {
            return page && page >= 1 && page <= this.totalPages;
        }
    };
} 
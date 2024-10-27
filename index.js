// Attr name bound to each midi-player to track if player is currently at the end
// of the loop. 
// This is a workaround for https://github.com/cifkao/html-midi-player/issues/23
const HAS_FINISHED = "has_finished";

$(document).ready(function() {
    drawPianoStaff();

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

// TODO: This works but I don't think magenta supports drawing a bass-treble sheet combo well -- they're disjoint.
// Let's use another library.
function drawPianoStaff() {
    const midiUrl = "midi/Fodland_winds.mid";
    document.getElementById("myVisualizer");
    getNoteSequence(midiUrl).then(noteSequence => {
        const right_visualizer = document.getElementById("right-hand-viz");
        rightNoteSequence = cloneNoteSequence(noteSequence);
        rightNoteSequence.notes = noteSequence.notes.filter(note => note.pitch >= 60);
        right_visualizer.noteSequence = rightNoteSequence;
        const left_visualizer = document.getElementById("left-hand-viz");
        leftNoteSequence = cloneNoteSequence(noteSequence);
        leftNoteSequence.notes = noteSequence.notes.filter(note => note.pitch < 60);
        left_visualizer.noteSequence = leftNoteSequence;
    }).catch(error => {
        console.error("Error fetching NoteSequence:", error);
    });
}

async function getNoteSequence(midiUrl) {
    const response = await fetch(midiUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch MIDI file.");
    }

    const midiData = await response.arrayBuffer();
    const noteSequence = mm.midiToSequenceProto(midiData);
    return noteSequence;
}

function cloneNoteSequence(noteSequence) {
    return JSON.parse(JSON.stringify(noteSequence));
}
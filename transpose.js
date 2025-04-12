// Extract root & suffix of a chord
function parseSingleChord(chord) {
    const match = chord.match(/^([A-G]#?)(.*)$/);
    return match ? { root: match[1], suffix: match[2] } : null;
}

// Transpose a note (without any suffix)
function transposeNote(note, semitones) {
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    let index = chromatic.indexOf(note);
    if (index === -1) return note;

    let newIndex = (index + semitones) % chromatic.length;
    if (newIndex < 0) newIndex += chromatic.length;

    return chromatic[newIndex];
}

// Normalize a chord (example: Ebm --transpose--> Fbm --normalize--> Em)
function normalizeChord(chord) {
    const normalize = { "Cb": "B", "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#", "E#": "F", "B#": "C" };

    for (const key in normalize) {
        chord = chord.replace(key, normalize[key]);
    }

    return chord;
}

function transposeChord(chord, semitones) {
    // Slash chords handling
    const [rootChord, bassChord] = chord.split('/');

    // Root chord transpose
    const { root: rootChordRoot, suffix: rootChordSuffix } = parseSingleChord(rootChord);
    const newRootChord = `${transposeNote(rootChordRoot, semitones)}${rootChordSuffix}`;

    // Bass chord transpose (if exists)
    if (bassChord) {
        const { root: bassChordRoot, suffix: bassChordSuffix } = parseSingleChord(bassChord);
        const newBassChord = `${transposeNote(bassChordRoot, semitones)}${bassChordSuffix}`;
        return `${newRootChord}/${newBassChord}`;
    }

    return `${normalizeChord(newRootChord)}`;
}
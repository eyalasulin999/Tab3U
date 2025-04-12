function banner() {
    console.log(`%c
        /$$$$$$$$        /$$        /$$$$$$  /$$   /$$ 
        |__  $$__/       | $$       /$$__  $$| $$  | $$
           | $$  /$$$$$$ | $$$$$$$ |__/  \\ $$| $$  | $$
           | $$ |____  $$| $$__  $$   /$$$$$/| $$  | $$
           | $$  /$$$$$$$| $$  \\ $$  |___  $$| $$  | $$
           | $$ /$$__  $$| $$  | $$ /$$  \\ $$| $$  | $$
           | $$|  $$$$$$$| $$$$$$$/|  $$$$$$/|  $$$$$$/
           |__/ \\_______/|_______/  \\______/  \\______/ 
    
                Tab3U script injected - FuCk Tab4U
    `, "color: #ed4e4c");
}

function chordsMapping() {
    // Get elements with class `chords` & `chords_en`
    const chordLines = document.getElementsByClassName("chords");
    const chordLinesEN = document.getElementsByClassName("chords_en");

    // Merge chords & convert to an Array()
    const mergedChordLines = [...new Set([...chordLines, ...chordLinesEN])];

    // Extract chords from each line & remove dups
    global.chords = [...new Set(mergedChordLines.flatMap(line => Array.from(line.getElementsByClassName("c_C"))))];
}

function transposeChords(semitones) {
    global.chords.forEach(chord => {
        chord.innerText = transposeChord(chord.innerText, semitones);
    });
}

function init() {
    // GLOBALS
    window.global = window.global || {};
    global.chords = Array();
    global.currentTranspose = 0.0;

    banner();
    chordsMapping();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.type) {
            case 'chordsExist':
                sendResponse({ chordsExist: global.chords.length ? true : false });
                break;
            case 'status':
                sendResponse({ currentTranspose: global.currentTranspose });
                break;
            case 'transposeUp':
                global.currentTranspose += 0.5;
                transposeChords(1);
                break;
            case 'transposeDown':
                global.currentTranspose -= 0.5;
                transposeChords(-1);
                break;
        }

        return true;
    });
}

// Run init function
init();
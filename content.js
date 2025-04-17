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

function createToolbar() {
    // Create toolbar div
    const songContent = document.getElementById("songContentTPL");
    if (!songContent) {
        return;
    }
    const toolbarElement = document.createElement("div");
    toolbarElement.id = "tab3uToolbar";
    songContent.insertBefore(toolbarElement, songContent.firstChild);

    // CSS stylesheet link
    const linkTag = document.createElement("link");
    linkTag.rel = "stylesheet";
    linkTag.href = chrome.runtime.getURL("toolbar.css");
    toolbarElement.insertBefore(linkTag, toolbarElement.firstChild);

    // Create the "+" button
    const upButton = document.createElement('button');
    upButton.id = 'transpose-up-btn';
    upButton.textContent = '+';

    // Create the label
    const label = document.createElement('label');
    label.id = 'current-transpose-label';
    label.textContent = '__';

    // Create the "−" button
    const downButton = document.createElement('button');
    downButton.id = 'transpose-down-btn';
    downButton.textContent = '−';

    toolbarElement.appendChild(upButton);
    toolbarElement.appendChild(label);
    toolbarElement.appendChild(downButton);
}

function init() {
    // GLOBALS
    window.global = window.global || {};
    global.chords = Array();
    global.currentTranspose = 0.0;

    banner();
    chordsMapping();
    if (global.chords.length) {
        createToolbar();
    }

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
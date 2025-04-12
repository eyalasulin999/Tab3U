function pageWrongWebsite() {
    document.getElementById("wrong-website").style.display = "block";
    document.getElementById("no-chords").style.display = "none";
    document.getElementById("transpose").style.display = "none";
}

function pageNoChords() {
    document.getElementById("wrong-website").style.display = "none";
    document.getElementById("no-chords").style.display = "block";
    document.getElementById("transpose").style.display = "none";
}

function pageTranspose() {
    document.getElementById("wrong-website").style.display = "none";
    document.getElementById("no-chords").style.display = "none";
    document.getElementById("transpose").style.display = "flex";
}

async function getActiveTab() {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return activeTab;
}

function sendMessage(type, activeTab = null) {
    if (activeTab) {
        return chrome.tabs.sendMessage(activeTab.id, { type: type });
    }
    else {
        return getActiveTab().then(activeTab => {
            return chrome.tabs.sendMessage(activeTab.id, { type: type });
        });
    }
}

function render() {
    sendMessage("status").then(response => {
        if (response && response.hasOwnProperty("currentTranspose")) {
            document.getElementById("current-transpose-label").innerText = response.currentTranspose.toFixed(1);
        }
    });
}

document.getElementById("transpose-up-btn").addEventListener("click", () => {
    sendMessage("transposeUp");
    render();
});

document.getElementById("transpose-down-btn").addEventListener("click", () => {
    sendMessage("transposeDown");
    render();
});

function init() {
    getActiveTab().then(activeTab => {
        // Validate current tab is Tab4U
        if (activeTab.url && !activeTab.url.includes("tab4u.com")) {
            pageWrongWebsite();
            return
        }

        // Check if chords exist
        sendMessage("chordsExist", activeTab).then(response => {
            if (response && response.hasOwnProperty("chordsExist") && response.chordsExist) {
                pageTranspose();
            }
            else {
                pageNoChords();
            }
        });
    });

    render();
}

// Run init() function on `DOMContentLoaded`
document.addEventListener("DOMContentLoaded", () => {
    init();
});
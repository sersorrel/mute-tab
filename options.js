import {getRegularColour, setRegularColour, getIncognitoColour, setIncognitoColour, getDebugMode, setDebugMode} from './config.js'

let collectedDebugLogs = [];
let debugMode = false;
getDebugMode().then(val => {
  debugMode = val
})

function loadOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  let incognitoColour = document.getElementById("incognito-colour")
  getRegularColour().then(val => {
    colour.value = val
  }).catch(error => {
    status.textContent = `Couldn't load settings: ${error}`
  })
  getIncognitoColour().then(val => {
    incognitoColour.value = val
  }).catch(error => {
    status.textContent = `Couldn't load settings: ${error}`
  })
  // We always start with debug mode turned off.
  setDebugMode(false).catch(error => {
    status.textContent = `Couldn't load settings: ${error}`
  })
}

function saveOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  let incognitoColour = document.getElementById("incognito-colour")
  let debugMode = document.getElementById("debug-mode")
  setRegularColour(colour.value).then(() => {
    status.textContent = ""
  }).catch(error => {
    status.textContent = `Couldn't save settings: ${error}`
  })
  setIncognitoColour(incognitoColour.value).then(() => {
    status.textContent = ""
  }).catch(error => {
    status.textContent = `Couldn't save settings: ${error}`
  })
  setDebugMode(debugMode.checked).then(() => {
    status.textContent = ""
  }).catch(error => {
    status.textContent = `Couldn't save settings: ${error}`
  })
}

document.addEventListener("DOMContentLoaded", loadOptions)
for (let elem of document.getElementsByClassName("save")) {
  elem.addEventListener("input", saveOptions)
}
document.getElementById("debug-mode").addEventListener("input", () => {
  collectedDebugLogs = []
})

function updateDebugLogsVisibility() {
  let debugLogs = document.getElementById("debug-logs")
  let debugLogsUncollected = document.getElementById("debug-logs-uncollected")
  let debugLogsCollected = document.getElementById("debug-logs-collected")
  if (debugMode) {
    debugLogs.style.display = ""
  } else {
    debugLogs.style.display = "none"
  }
  debugLogsUncollected.style.display = ""
  debugLogsCollected.style.display = "none"
}

updateDebugLogsVisibility()

chrome.storage.onChanged.addListener((changes, areaName) => {
  let val = changes["debug-mode"]?.newValue
  if (val !== undefined) {
    debugMode = val
    updateDebugLogsVisibility()
  }
})

document.getElementById("copy-debug-logs").addEventListener("click", () => {
  let debugLogsString = collectedDebugLogs.join("\n")
  navigator.clipboard.writeText(`=== Tab Muter debug logs ===\nlogs collected: ${(new Date()).toISOString()}\nentries: ${collectedDebugLogs.length}\n` + debugLogsString + "\n=== end ===\n").catch(error => {
    document.getElementById("status").textContent = `Couldn't copy logs to clipboard: ${error}`
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "log") {
    if (debugMode) {
      let debugLogsUncollected = document.getElementById("debug-logs-uncollected")
      let debugLogsCollected = document.getElementById("debug-logs-collected")
      collectedDebugLogs.push(`${(new Date()).toISOString()} ${message.level}: ${message.content}`)
      debugLogsUncollected.style.display = "none"
      debugLogsCollected.style.display = ""
    }
  }
})

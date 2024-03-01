import {getColour, setDebugMode} from './config.js'
import {error, warn, info, debug} from './debug.js'

// Set the toolbar icon to the audible one.
function doAudibleIcon(tab) {
  debug(`set icon to audible, tab ${JSON.stringify(tab)}`)
  getColour(tab).then(colour => {
    chrome.action.setIcon({
      "path": {
        "19": `images/audible-${colour}-19.png`,
        "38": `images/audible-${colour}-38.png`,
      },
      "tabId": tab.id,
    })
    chrome.action.setTitle({
      "title": "Mute tab",
      "tabId": tab.id,
    })
  }).catch(e => {
    error("Couldn't load settings:", e)
  })
}

// Set the toolbar icon to the muted one.
function doMutedIcon(tab) {
  debug(`set icon to muted, tab ${JSON.stringify(tab)}`)
  getColour(tab).then(colour => {
    chrome.action.setIcon({
      "path": {
        "19": `images/muted-${colour}-19.png`,
        "38": `images/muted-${colour}-38.png`,
      },
      "tabId": tab.id,
    })
    chrome.action.setTitle({
      "title": "Unmute tab",
      "tabId": tab.id,
    })
  }).catch(e => {
    error("Couldn't load settings:", e)
  })
}

function updateIcon(tab) {
  if (tab.mutedInfo.muted) {
    doMutedIcon(tab)
  } else {
    doAudibleIcon(tab)
  }
}

// Toggle the mute state of a tab.
function toggleMuted(tab) {
  debug(`toggle mute state, tab ${JSON.stringify(tab)}`)
  let isMuted = tab.mutedInfo.muted
  chrome.tabs.update(tab.id, {"muted": !isMuted})
  // Note: the icon is updated elsewhere (this is to make sure that the
  // icon doesn't get out of sync if the tab mute state is changed by
  // something else).
}

// Keep track of the last few times the Tab Muter icon was clicked.
// We'll use this to try and figure out if the user is confused by the button not working.
const lastActions = [];
const LAST_ACTIONS_LIMIT = 5;

// Attempt to detect situations where the user is confused and clicking the icon repeatedly.
// If confusion is detected, open a popup with some suggestions.
function tryDetectConfusion() {
  let isConfused = false; // we hope

  // Things that might happen if you're confused:
  // - you click the button several times quickly (3 times in 4 seconds is probably confusion, 3 times in 10 seconds or even 5 seconds might not be)
  // - you click the button several times, slowly, on the same tab
  //   - this is a noisy heuristic; we add a condition that the tab is not `audible`, i.e. it's on the "not doing anything" side of issue #3
  // Since we can't rely on openPopup() being available, err on the side of displaying the popup a little too early.
  if (lastActions.length >= 3) {
    const [a, b, c] = lastActions.slice(-3)
    if (c.time - a.time < 4000) {
      // clicked several times quickly
      isConfused = true
    }
    if (a.tab.id === b.tab.id && b.tab.id === c.tab.id && !a.tab.audible && !b.tab.audible && !c.tab.audible) {
      // clicked repeatedly on the same inaudible tab
      isConfused = true
    }
  }

  if (isConfused) { // an unfortunate possibility
    console.log("confusion detected!")
    chrome.storage.local.get({ suppressIssue3Popup: false }).then(({ suppressIssue3Popup }) => {
      if (suppressIssue3Popup) {
        console.log("not mitigating confusion: popup is suppressed")
        return
      }
      console.log("mitigating confusion...")
      chrome.action.setPopup({ popup: "popup.html" })
      if (chrome.action.openPopup) {
        try {
          chrome.action.openPopup("popup.html")
        } catch (err) {
          console.log("openPopup() failed:", err)
        } finally {
          chrome.action.setPopup({ popup: "" })
        }
      } else {
        console.log("openPopup() unavailable, using alternative approach")
        // openPopup() is only available if we were installed by policy.
        // As a fallback, leave the popup set, to be opened next time the user clicks, and set a timer to clear the popup again.
        // Note that extension service workers will be terminated after 30 seconds of idling, so we might not have very long to do this.
        // According to MDN, "In WebExtensions, setTimeout() does not work reliably"; unfortunately, chrome.alarms requires a permission, and it's not reasonable to add a permission for this feature alone.
        setTimeout(() => {
          console.log("clearing popup: timer expired")
          chrome.action.setPopup({ popup: "" })
        }, 20 * 1000)
      }
    })
  }
}

// Event listener for the toolbar icon being clicked.
chrome.action.onClicked.addListener(tab => {
  info(`icon clicked, tab ${JSON.stringify(tab)}`)
  lastActions.push({ tab: structuredClone(tab), time: Date.now() })
  if (lastActions.length > LAST_ACTIONS_LIMIT) {
    lastActions.shift()
  }
  if (tab !== undefined) {
    toggleMuted(tab)
  } else {
    warn("couldn't toggle, no tab!")
  }
  tryDetectConfusion()
})

// Update the icon whenever necessary.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.hasOwnProperty("mutedInfo") || changeInfo.hasOwnProperty("status")) {
    updateIcon(tab)
  }
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync") {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        updateIcon(tab)
      })
    })
  }
})

chrome.runtime.onStartup.addListener(() => {
  setDebugMode(false)
})

chrome.runtime.onInstalled.addListener(() => {
  setDebugMode(false)
})

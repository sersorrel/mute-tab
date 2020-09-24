import {getColour, setDebugMode} from './config.js'
import {error, warn, info, debug} from './debug.js'

// Set the toolbar icon to the audible one.
function doAudibleIcon(tab) {
  debug(`set icon to audible, tab ${JSON.stringify(tab)}`)
  getColour(tab).then(colour => {
    chrome.browserAction.setIcon({
      "path": {
        "19": `images/audible-${colour}-19.png`,
        "38": `images/audible-${colour}-38.png`,
      },
      "tabId": tab.id,
    })
    chrome.browserAction.setTitle({
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
    chrome.browserAction.setIcon({
      "path": {
        "19": `images/muted-${colour}-19.png`,
        "38": `images/muted-${colour}-38.png`,
      },
      "tabId": tab.id,
    })
    chrome.browserAction.setTitle({
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

// Event listener for the toolbar icon being clicked.
chrome.browserAction.onClicked.addListener(tab => {
  info(`icon clicked, tab ${JSON.stringify(tab)}`)
  if (tab !== undefined) {
    toggleMuted(tab)
  } else {
    warn("couldn't toggle, no tab!")
  }
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

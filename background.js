import {getColour} from './config.js'

// Set the toolbar icon to the audible one.
function doAudibleIcon(tab) {
  console.log("set icon to audible, tab %o", tab)
  getColour().then(colour => {
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
  }).catch(error => {
    console.error("Couldn't load settings:", error)
  })
}

// Set the toolbar icon to the muted one.
function doMutedIcon(tab) {
  console.log("set icon to muted, tab %o", tab)
  getColour().then(colour => {
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
  }).catch(error => {
    console.error("Couldn't load settings:", error)
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
  console.log("toggle mute state, tab %o", tab)
  let isMuted = tab.mutedInfo.muted
  chrome.tabs.update(tab.id, {"muted": !isMuted})
  // Note: the icon is updated elsewhere (this is to make sure that the
  // icon doesn't get out of sync if the tab mute state is changed by
  // something else).
}

// Event listener for the toolbar icon being clicked.
chrome.browserAction.onClicked.addListener(tab => {
  console.group("icon clicked, tab %o", tab)
  if (tab !== undefined) {
    toggleMuted(tab)
  } else {
    console.warn("couldn't toggle, no tab!")
  }
  console.groupEnd()
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

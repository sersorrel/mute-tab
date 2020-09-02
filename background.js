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

// Toggle the mute state of a tab.
function toggleMuted(tab) {
  console.log("toggle mute state, tab %o", tab)
  let isMuted = tab.mutedInfo.muted
  chrome.tabs.update(tab.id, {"muted": !isMuted})
  // Note: the icon is updated down below, by the chrome.tabs.onUpdated
  // listener (this is to make sure that the icon doesn't get out of
  // sync if the tab mute state is changed by something else).
}

// Event listener for the toolbar icon being clicked.
chrome.browserAction.onClicked.addListener(tab => {
  console.log("icon clicked, tab %o", tab)
  if (tab !== undefined) {
    toggleMuted(tab)
  } else {
    console.warn("couldn't toggle, no tab!")
  }
})

// Update the icon whenever necessary.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.hasOwnProperty("mutedInfo")) {
    let currStateStr = tab.mutedInfo.muted ? "MUTED" : "AUDIBLE"
    if (changeInfo.mutedInfo.muted) {
      console.log(`mutestate: ${currStateStr} -> MUTED, tab %o`, tab)
      doMutedIcon(tab)
    } else {
      console.log(`mutestate: ${currStateStr} -> AUDIBLE, tab %o`, tab)
      doAudibleIcon(tab)
    }
  } else if (changeInfo.hasOwnProperty("status")) {
    // Apparently the toolbar icon gets reset to the default once
    // another page starts loading, so we have to reset it whenever that
    // happens.
    if (changeInfo.status === "loading") {
      console.log("page load detected, reset icon to match, tab %o", tab)
      if (tab.mutedInfo.muted) {
        doMutedIcon(tab)
      } else {
        doAudibleIcon(tab)
      }
    }
  }
})

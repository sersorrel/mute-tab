import {getColour} from './config.js'

// Set the toolbar icon to the audible one.
function doAudibleIcon(tab) {
  console.log("set icon -> audible")
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
    console.error(`Couldn't load settings: ${error}`)
  })
}

// Set the toolbar icon to the muted one.
function doMutedIcon(tab) {
  console.log("set icon -> muted")
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
    console.error(`Couldn't load settings: ${error}`)
  })
}

// Toggle the mute state of a tab.
function toggleMuted(tab) {
  console.log(`toggleMuted`)
  let isMuted = tab.mutedInfo.muted
  chrome.tabs.update(tab.id, {"muted": !isMuted})
  // Note: the icon is updated down below, by the chrome.tabs.onUpdated
  // listener (this is to make sure that the icon doesn't get out of
  // sync if the tab mute state is changed by something else).
}

// Event listener for the toolbar icon being clicked.
chrome.browserAction.onClicked.addListener(tab => {
  console.log("toggle mute state (icon click)")
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
      console.log(`mutestate: ${currStateStr} -> MUTED`)
      doMutedIcon(tab)
    } else {
      console.log(`mutestate: ${currStateStr} -> AUDIBLE`)
      doAudibleIcon(tab)
    }
  } else if (changeInfo.hasOwnProperty("status")) {
    // Apparently the toolbar icon gets reset to the default once
    // another page starts loading, so we have to reset it whenever that
    // happens.
    if (changeInfo.status === "loading") {
      console.log("page load detected, reset icon to match")
      if (tab.mutedInfo.muted) {
        doMutedIcon(tab)
      } else {
        doAudibleIcon(tab)
      }
    }
  }
})

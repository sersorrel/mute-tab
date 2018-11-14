// Set the toolbar icon to the audible one.
function doAudibleIcon(tab) {
  console.log("set icon -> audible")
  chrome.storage.sync.get({
    "colour": "dark",
  }, function(items) {
    if (chrome.runtime.lastError) {
      console.error("Couldn't load settings: " + chrome.runtime.lastError)
    }
    chrome.browserAction.setIcon({
      "path": {
        "19": `images/audible-${items.colour}-19.png`,
        "38": `images/audible-${items.colour}-38.png`,
      },
      "tabId": tab.id,
    })
    chrome.browserAction.setTitle({
      "title": "Mute tab",
      "tabId": tab.id,
    })
  })
}

// Set the toolbar icon to the muted one.
function doMutedIcon(tab) {
  console.log("set icon -> muted")
  chrome.storage.sync.get({
    "colour": "dark",
  }, function(items) {
    if (chrome.runtime.lastError) {
      console.error("Couldn't load settings: " + chrome.runtime.lastError)
    }
    chrome.browserAction.setIcon({
      "path": {
        "19": `images/muted-${items.colour}-19.png`,
        "38": `images/muted-${items.colour}-38.png`,
      },
      "tabId": tab.id,
    })
    chrome.browserAction.setTitle({
      "title": "Unmute tab",
      "tabId": tab.id,
    })
  })
}

// Toggle the mute state of a tab.
function toggleMuted(tab) {
  console.log(`toggleMuted`)
  var isMuted = tab.mutedInfo.muted
  chrome.tabs.update(tab.id, {"muted": !isMuted})
  // Note: the icon is updated down below, by the chrome.tabs.onUpdated
  // listener (this is to make sure that the icon doesn't get out of
  // sync if the tab mute state is changed by something else).
}

// Event listener for the toolbar icon being clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("toggle mute state (icon click)")
  if (tab !== undefined) {
    toggleMuted(tab)
  } else {
    console.warn("couldn't toggle, no tab!")
  }
})

// Update the icon whenever necessary.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.hasOwnProperty("mutedInfo")) {
    var currStateStr = tab.mutedInfo.muted ? "MUTED" : "AUDIBLE"
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

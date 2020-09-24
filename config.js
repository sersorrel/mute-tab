function syncedStorageGet(name, fallback = undefined) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({[name]: fallback}, items => {
      let e = chrome.runtime.lastError
      if (e) {
        reject(Error(e.message))
      } else {
        resolve(items[name])
      }
    })
  })
}

function syncedStorageSet(name, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({[name]: value}, () => {
      let e = chrome.runtime.lastError
      if (e) {
        reject(Error(e.message))
      } else {
        resolve()
      }
    })
  })
}

function localStorageGet(name, fallback = undefined) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({[name]: fallback}, items => {
      let e = chrome.runtime.lastError
      if (e) {
        reject(Error(e.message))
      } else {
        resolve(items[name])
      }
    })
  })
}

function localStorageSet(name, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({[name]: value}, () => {
      let e = chrome.runtime.lastError
      if (e) {
        reject(Error(e.message))
      } else {
        resolve()
      }
    })
  })
}

export function getRegularColour() {
  return syncedStorageGet("colour", "dark")
}

export function setRegularColour(val) {
  return syncedStorageSet("colour", val)
}

export function getIncognitoColour() {
  return syncedStorageGet("incognito-colour", "light")
}

export function setIncognitoColour(val) {
  return syncedStorageSet("incognito-colour", val)
}

export function getColour(tab) {
  if (tab.incognito) {
    return getIncognitoColour()
  } else {
    return getRegularColour()
  }
}

export function setColour(val) {
  if (chrome.extension.inIncognitoContext) {
    return setIncognitoColour(val)
  } else {
    return setRegularColour(val)
  }
}

export function getDebugMode() {
  return localStorageGet("debug-mode", false)
}

export function setDebugMode(val) {
  return localStorageSet("debug-mode", val)
}

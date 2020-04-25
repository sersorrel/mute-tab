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

export function getColour() {
  return syncedStorageGet("colour", "dark")
}

export function setColour(val) {
  return syncedStorageSet("colour", val)
}

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

function getColour() {
  return syncedStorageGet("colour", "dark")
}

function setColour(val) {
  return syncedStorageSet("colour", val)
}

function loadOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  getColour().then(val => {
    colour.value = val
  }).catch(error => {
    status.textContent = `Couldn't load settings: ${error}`
  })
}

function saveOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  setColour(colour.value).then(() => {
    status.textContent = ""
  }).catch(error => {
    status.textContent = `Couldn't save settings: ${error}`
  })
}

document.addEventListener("DOMContentLoaded", loadOptions)
for (let elem of document.getElementsByClassName("save")) {
  elem.addEventListener("input", saveOptions)
}

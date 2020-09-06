import {getRegularColour, setRegularColour, getIncognitoColour, setIncognitoColour, getDebugMode, setDebugMode} from './config.js'

function loadOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  let incognitoColour = document.getElementById("incognito-colour")
  let debugMode = document.getElementById("debug-mode")
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
  getDebugMode().then(val => {
    debugMode.checked = val
  }).catch(error => {
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

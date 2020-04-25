import {getRegularColour, setRegularColour, getIncognitoColour, setIncognitoColour} from './config.js'

function loadOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  let incognitoColour = document.getElementById("incognito-colour")
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
}

function saveOptions() {
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")
  let incognitoColour = document.getElementById("incognito-colour")
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
}

document.addEventListener("DOMContentLoaded", loadOptions)
for (let elem of document.getElementsByClassName("save")) {
  elem.addEventListener("input", saveOptions)
}

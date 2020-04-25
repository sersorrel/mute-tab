import {getColour, setColour} from './config.js'

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

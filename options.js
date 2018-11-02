function loadOptions() {
  console.log("loading options")
  let status = document.getElementById("status")
  let colour = document.getElementById("colour")

  chrome.storage.sync.get({
    "colour": "dark",
  }, function(items) {
    if (chrome.runtime.lastError) {
      status.textContent = "Couldn't load settings: " + chrome.runtime.lastError
    }
    colour.value = items.colour
    console.log(`done loading (colour: ${items.colour})`)
  })
}

function saveOptions() {
  console.log("saving options")
  var status = document.getElementById("status")
  var colour = document.getElementById("colour")
  status.textContent = ""

  chrome.storage.sync.set({
    "colour": colour.value,
  }, function() {
    // "Done" callback
    if (chrome.runtime.lastError) {
      status.textContent = "Couldn't save settings: " + chrome.runtime.lastError
    }
    console.log(`done saving (colour: ${colour.value})`)
  })
}

document.addEventListener("DOMContentLoaded", loadOptions)
for (let elem of document.getElementsByClassName("save")) {
  console.log(elem)
  elem.addEventListener("input", saveOptions)
}

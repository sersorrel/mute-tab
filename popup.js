// once the popup's been open for more than two seconds, assume the user isn't going to close it by accident and try to quickly reopen it
setTimeout(() => {
  console.log("clearing popup: has been open for two seconds")
  chrome.action.setPopup({ popup: "" })
}, 2 * 1000)

document.getElementById("go-away").onclick = () => {
  console.log("setting suppressIssue3Popup pref")
  chrome.storage.local.set({ suppressIssue3Popup: true }).then(() => {
    window.close()
  }, err => {
    document.getElementById("errors").textContent = `could not save setting: ${err}`
  })
}

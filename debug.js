import {getDebugMode} from './config.js'

const LogLevel = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
}

let debugMode = false;
getDebugMode().then(val => {
  debugMode = val
})

function log(level, ...args) {
  switch (level) {
    case LogLevel.ERROR:
      console.error(...args)
      break
    case LogLevel.WARN:
      console.warn(...args)
      break
    case LogLevel.INFO:
      console.info(...args)
      break
    case LogLevel.DEBUG:
      console.debug(...args)
      break
  }
  if (debugMode) {
    chrome.runtime.sendMessage({type: "log", level: level, content: args})
  }
}

export function error(...args) {
  log(LogLevel.ERROR, ...args)
}

export function warn(...args) {
  log(LogLevel.WARN, ...args)
}

export function info(...args) {
  log(LogLevel.INFO, ...args)
}

export function debug(...args) {
  log(LogLevel.DEBUG, ...args)
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  let val = changes["debug-mode"]?.newValue
  if (val !== undefined) {
    debugMode = val
  }
})

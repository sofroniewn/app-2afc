var electron = require('electron')
var IPCStream = require('electron-ipc-stream')
var deviceStream = require('device-stream-2choice-stdin')
var experimentStream = require('experiment-stream-2choice-2afc')

var app = electron.app
var BrowserWindow = electron.BrowserWindow
var mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 650
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function updateLED () {
  var blueLED = Math.random() < 0.5
  var redLED = !blueLED
  return {
    blueLED: blueLED,
    redLED: redLED
  }
}

app.on('ready', function() {
  createWindow()
  var ipcs = new IPCStream('test', mainWindow)

  var device = deviceStream.createStream()
  var initial = updateLED()
  var expt = experimentStream.createStream(updateLED, initial)
  device.write(initial)

  var results = device.pipe(expt)
  results.pipe(device)
  results.pipe(ipcs)
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
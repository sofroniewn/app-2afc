var IPCStream = require('electron-ipc-stream')
var ipcs = new IPCStream('test')

//////////////////////////////////////////////////////////////////////////
var writer = require('to2')

createLED = function () {
  var LED = document.createElement('canvas')
  LED.width = 100
  LED.height = 100
  LED.style.backgroundColor = '#000000'
  LED.style.border = '0px solid white'
  return LED
}

createVizualizationStream = function () {
  var correctLED = createLED()
  document.body.appendChild(correctLED)

  var score = 0
  var scoreEl =  document.createElement('h2')
  scoreEl.id = 'score';
  scoreEl.innerHTML = 'Score ' + score;
  document.body.appendChild(scoreEl);

  return writer.obj(function (data, enc, callback) {
    if (data.correct) {
      correctLED.style.backgroundColor = '#00ff00'
    } else {
      correctLED.style.backgroundColor = '#000000'
    }

    scoreEl.innerHTML =  'Score ' + data.score;
    
    callback()
  })
}
//////////////////////////////////////////////////////////////////////////


var viz = createVizualizationStream()


//////////////////////////////////////////////////////////////////////////
var lightningStream = require('lightning-stream')
var line = require('lightning-line-streaming')
var div = document.createElement('div')
div.style.width='700px'
var el = document.body.appendChild(div)
var data = {series: [0]}
var vizGraph = new line(el, {
  'series': [0],
  'index': [0],
  'xaxis': 'Trial (#)',
  'yaxis': 'Score (#)',
  'thickness': 7,
  'color': [255, 100, 0]
}, [], {'zoom': false})

function mapping (data) {
  return {series: [data.score]}
}
//////////////////////////////////////////////////////////////////////////


var graph = lightningStream(vizGraph, mapping)


ipcs.pipe(viz)
ipcs.pipe(graph)


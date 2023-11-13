let audio1 = new Audio()
audio1.crossOrigin = 'anonymous'
audio1.src =
  // 'https://alandouglasphotography.s3.eu-central-1.amazonaws.com/modjo-lady.mp3'
  'https://cdn.sanity.io/files/7og2dskj/production/b2882c52227e91c11d8f132489e9c93edddcd75e.m4a'
let playing = false

var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)

let animationId = 'temp'
let worker = null

let audioSource = null
let analyser = null
let audioCtx = null

container.addEventListener('click', function () {
  playing = !playing
  if (playing) {
    audio1.play()
    document.getElementById('playText').innerHTML = 'PAUSE'

    if (isSafari) {
      let canvas = document.getElementById('canvas')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      if (audioSource === null) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        audioSource = audioCtx.createMediaElementSource(audio1)
        analyser = audioCtx.createAnalyser()
      }

      audioSource.connect(analyser)
      analyser.connect(audioCtx.destination)

      analyser.fftSize = 128
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      let x = 0
      function animateSafari() {
        x = 0
        analyser.getByteFrequencyData(dataArray)
        drawVisualizerForSafari({ bufferLength, dataArray }, {})
        animationId = requestAnimationFrame(animateSafari)
      }

      animateSafari()
    } else {
      // TESTINGAL -> Using service worker
      // let canvas = document.getElementById('canvas')
      // canvas.width = window.innerWidth
      // canvas.height = window.innerHeight
      // let offscreenCanvas = canvas.transferControlToOffscreen()
      // worker = new Worker(new URL('./worker.js', import.meta.url))
      // worker.postMessage({ offscreenCanvas }, [offscreenCanvas])
      // if (audioSource === null) {
      //   audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      //   audioSource = audioCtx.createMediaElementSource(audio1)
      //   analyser = audioCtx.createAnalyser()
      // }
      // audioSource.connect(analyser)
      // analyser.connect(audioCtx.destination)
      // analyser.fftSize = 128
      // const bufferLength = analyser.frequencyBinCount
      // const dataArray = new Uint8Array(bufferLength)
      // let x = 0
      // function animate() {
      //   x = 0
      //   analyser.getByteFrequencyData(dataArray)
      //   worker.postMessage({ bufferLength, dataArray }, {})
      //   animationId = requestAnimationFrame(animate)
      // }
      // animate()

      let canvas = document.getElementById('canvas')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      if (audioSource === null) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        audioSource = audioCtx.createMediaElementSource(audio1)
        analyser = audioCtx.createAnalyser()
      }

      audioSource.connect(analyser)
      analyser.connect(audioCtx.destination)

      analyser.fftSize = 128
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      let x = 0
      function animateBrowser() {
        x = 0
        analyser.getByteFrequencyData(dataArray)
        drawVisualizerForSafari({ bufferLength, dataArray }, {})
        animationId = requestAnimationFrame(animateBrowser)
      }

      animateBrowser()
    }
  } else {
    audio1.pause()
    cancelAnimationFrame(animationId)
    document.getElementById('playText').innerHTML = 'PRESS TO PLAY'
  }
})

const drawVisualizerForSafari = ({ bufferLength, dataArray }) => {
  const barWidth = canvas.width / 2 / bufferLength // the width of each bar in the canvas
  let firstX = 0 // used to draw the bars one after another. This will get increased by the width of one bar

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height) // clears the canvas

  let barHeight
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2
    const red = (i * barHeight) / 15
    const green = i * 4
    const blue = barHeight / 4 - 12
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
    ctx.fillRect(
      canvas.width / 2 - firstX, // this will start the bars at the center of the canvas and move from right to left
      canvas.height - barHeight,
      barWidth,
      barHeight
    )
    firstX += barWidth // increases the x value by the width of the bar
  }

  let secondX = 0
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2
    const red = (i * barHeight) / 15
    const green = i * 4
    const blue = barHeight / 4 - 12
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
    ctx.fillRect(
      canvas.width / 2 + secondX,
      canvas.height - barHeight,
      barWidth,
      barHeight
    ) // this will continue moving from left to right
    secondX += barWidth // increases the x value by the width of the bar
  }
}

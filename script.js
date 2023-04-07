let audio1 = new Audio()
audio1.src = 'modjo-lady.mp3'

const container = document.getElementById('container')
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let audioSource = null
let analyser = null

// audio1.play()
audioSource = audioCtx.createMediaElementSource(audio1)
analyser = audioCtx.createAnalyser()
audioSource.connect(analyser)
analyser.connect(audioCtx.destination)

analyser.fftSize = 128
const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(bufferLength)
const barWidth = canvas.width / bufferLength

let x = 0
function animate() {
  x = 0
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  analyser.getByteFrequencyData(dataArray)
  let barHeight
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]
    const red = (i * barHeight) / 10
    const green = i * 4
    const blue = barHeight / 4 - 12
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
    x += barWidth
  }

  requestAnimationFrame(animate)
}

animate()

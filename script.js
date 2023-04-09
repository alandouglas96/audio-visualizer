container.addEventListener('click', function () {
  let audio1 = new Audio()
  audio1.src = 'modjo-lady.mp3'

  let canvas = document.getElementById('canvas').transferControlToOffscreen()
  const worker = new Worker(new URL('./worker.js', import.meta.url))

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  worker.postMessage({ canvas }, [canvas])

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  let audioSource = null
  let analyser = null

  audio1.play()
  audioSource = audioCtx.createMediaElementSource(audio1)
  analyser = audioCtx.createAnalyser()
  audioSource.connect(analyser)
  analyser.connect(audioCtx.destination)

  analyser.fftSize = 128
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  const barWidth = canvas.width / bufferLength / 2

  // let x = 0
  // function animate() {
  //   x = 0
  //   ctx.clearRect(0, 0, canvas.width, canvas.height)
  //   analyser.getByteFrequencyData(dataArray)
  //   drawVisualizer({
  //     bufferLength,
  //     dataArray,
  //     barWidth,
  //   })
  //   requestAnimationFrame(animate)
  // }

  let x = 0
  function animate() {
    x = 0
    analyser.getByteFrequencyData(dataArray)
    worker.postMessage({ bufferLength, dataArray, barWidth, x }, {})
    requestAnimationFrame(animate)
  }

  animate()
})
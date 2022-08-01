var cropper = undefined
var elements = {
  img: null,
  imgResult: null,
}
var imgSrc = ''

function LoadCropper() {
  elements.img = document.getElementById('image')
  elements.imgResult = document.getElementById('image-cropped')
  InstantiateCropper()
}

function InstantiateCropper() {
  cropper = new Cropper(elements.img, {
    viewMode: 1,
    dragMode: 'move',
    toggleDragModeOnDblclick: false,
    minCropBoxHeight: 330,
    minCropBoxWidth: 220,
    aspectRatio: 220 / 330,
    zoom: function (event) {
      if (event.detail.ratio > 1) {
        event.preventDefault()
      }
    },
  })
}

function SaveCropper() {
  imgSrc = cropper.getCroppedCanvas().toDataURL('image/jpeg')
  sleep(function () {
    elements.imgResult.src = imgSrc
  })
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sleep(fn, ...args) {
  await timeout(3000)
  return fn(...args)
}

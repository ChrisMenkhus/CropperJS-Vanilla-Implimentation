;(function (container, modelInstanceId) {
  var util = BBUI.forms.Utility
  var cropper
  var imgSrc = {
    original: '',
    cropped: '',
  }
  var elements = {
    image_crop: null,
    button_refresh: null,
  }

  function FormLoad() {
    console.log('modelInstanceID: ', modelInstanceId)
    var id = 'ctrl_' + modelInstanceId.replace(/-/g, '_') + '_PICTURE_value'
    elements.img_crop = document.getElementById(id).getElementsByTagName('img')[0]
    elements.img_crop.addEventListener('load', LoadCropper, false)
    elements.button_refresh = $('#ctrl_' + modelInstanceId.replace(/-/g, '_') + '_REFRESH_action')
    elements.button_refresh.on('click', function (e) {
      e.preventDefault()
      SaveCropper()
    })

    LoadCropper()

    console.log(container)
  }

  function LoadCropper() {
    // hide relaunch action if LoadCropper() is run.
    $('#ctrl_' + modelInstanceId.replace(/-/g, '_') + '_RELAUNCH_action').hide()

    if (cropper !== undefined) {
      cropper.destroy()
    }

    cropper = InstantiateCropper()
  }

  function InstantiateCropper() {
    return new Cropper(elements.img_crop, {
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
    var croppedCanvas = cropper.getCroppedCanvas()
    imgSrc.cropped = croppedCanvas.toDataURL('image/jpeg', 0.9)

    cropper.clear()
    var uncroppedCanvas = cropper.getCroppedCanvas()
    imgSrc.original = uncroppedCanvas.toDataURL('image/jpeg', 0.9)

    //container.prototype.beginWait(250)

    //setTimeout(UpdateContainer, 1000, imgSrc.cropped, imgSrc.original)
    console.log('beginWait fired')

    util.beginWait()

    UpdateContainer(imgSrc.cropped, imgSrc.original)

    sleep(2000).then(function () {
      console.log('sleep fired')

      util.endWait()

      console.log('endWait fired')
    })

    //UpdateContainer(imgSrc.cropped, imgSrc.original)
  }

  function UpdateContainer(cropped, original) {
    console.log('cropped: ', cropped)
    console.log('original: ', original)
    var dimensions = [
      { name: 'CROPPEDPICTURE', value: cropped },
      { name: 'ORIGINALPICTURE', value: original },
    ]
    container.updateMultipleFields(modelInstanceId, dimensions)

    if (cropped !== '' && original !== '') {
      //util.endWait()
    }

    console.log('updateContainer fired')
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  container.on({
    render: FormLoad,
    formupdated: FormLoad,
    beforeformconfirmed: SaveCropper,
  })
})()

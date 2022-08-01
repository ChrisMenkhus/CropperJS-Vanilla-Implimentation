(function (container, modelInstanceId) {
  var util = BBUI.forms.Utility;
  var cropper = undefined;
  var elements = {
    img: null,
    imgResult: null,
  };
  var imgSrc = '';

  function FormLoad() {
    // elements.img.addEventListener('load', LoadCropper, false)
    // is this necessary?
    LoadCropper();
    // or is this necessary?
  }

  function LoadCropper() {
    // hide relaunch action if LoadCropper() is run.
    $(
      '#ctrl_' + modelInstanceId.replace(/-/g, '_') + '_RELAUNCH_action'
    ).hide();

    var id = 'ctrl_' + modelInstanceId.replace(/-/g, '_') + '_PICTURE_value';
    elements.img = document.getElementById(id).getElementsByTagName('img')[0];

    InstantiateCropper();
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
          event.preventDefault();
        }
      },
    });
  }

  function SaveCropper() {
    imgSrc = cropper.getCroppedCanvas().toDataURL('image/jpeg');
    sleep(UpdateContainer, imgSrc, imgSrc);
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function sleep(fn, ...args) {
    await timeout(500);
    return fn(...args);
  }

  function UpdateContainer(cropped, original) {
    var dimensions = [
      { name: 'CROPPEDPICTURE', value: cropped },
      { name: 'ORIGINALPICTURE', value: original },
    ];
    container.updateMultipleFields(modelInstanceId, dimensions);
  }

  container.on({
    render: FormLoad,
    formupdated: FormLoad,
    //beforeformconfirmed: SaveCropper,
    formconfirmed: SaveCropper,
  });
});

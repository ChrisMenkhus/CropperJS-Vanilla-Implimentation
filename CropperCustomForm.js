(function (container, modelInstanceId) {
	//#region Initialize Variables
	var imgElement;
	var saveButtonElement;
	var cropper;
	var cropped = '';
	var original = '';
	var selectorId = 'ctrl_' + modelInstanceId.replace(/-/g, '_');
	//#endregion

	//#region Initialize Form
	function FormLoad() {
		imgElement = document.getElementById(selectorId + '_PICTURE_value').getElementsByTagName('img')[0];
		saveButtonElement = document.getElementById(selectorId + '_SAVEFORM')

		imgElement.addEventListener('load', LoadCropper, false)
		saveButtonElement.addEventListener('click', SaveCropper)

		LoadCropper();
	}

	function LoadCropper() {
		if (cropper !== undefined) {
			cropper.destroy();
		}

		cropper = InstantiateCropper()
	}

	function InstantiateCropper() {
		return new Cropper(imgElement, {
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
	//#endregion

	//#region Save Cropped Image
	function SaveCropper() {
		if (cropper == undefined) return

		var croppedPictureField = container.getFieldByName("CROPPEDPICTURE", modelInstanceId)
		var originalPictureField = container.getFieldByName("ORIGINALPICTURE", modelInstanceId)

		var croppedCanvas = cropper.getCroppedCanvas()
		cropped = croppedCanvas.toDataURL('image/jpeg', 0.9)

		cropper.clear()
		var uncroppedCanvas = cropper.getCroppedCanvas()
		original = uncroppedCanvas.toDataURL('image/jpeg', 0.9)

		function isImgSrcValid() {
			return checkIfValid(cropped) && checkIfValid(original)
		}

		function isFieldsValid() {
			isCroppedValid = checkIfValid(croppedPictureField.value)
			isOriginalValid = checkIfValid(originalPictureField.value)
			return isCroppedValid && isOriginalValid
		}

		TickTimerConditionalCallback(250, 32, isImgSrcValid, function () {
			UpdateContainer(cropped, original)
		})

		TickTimerConditionalCallback(250, 32, isFieldsValid, function () {
			container.confirmForm()
		})
	}

	function UpdateContainer(cropped, original) {
		var dimensions = [
			{ name: 'CROPPEDPICTURE', value: cropped },
			{ name: 'ORIGINALPICTURE', value: original },
		]
		container.updateMultipleFields(modelInstanceId, dimensions)
	}
	//#endregion

	//#region Create Utility Functions
	function TickTimerConditionalCallback(timerLength, maxAmountOfAttempts, conditional, callback) {
		var amountOfAttempts = 1;
		var interval = setInterval(function () {
			if (amountOfAttempts <= maxAmountOfAttempts) {
				amountOfAttempts++;

				if (conditional()) {
					callback()
					clearInterval(interval)
				}
			}
			else {
				clearInterval(interval);
			}
		}, timerLength);
	}

	function checkIfValid(value) {
		return value !== null && value !== undefined && value != ''
	}
	//#endregion

	container.on({
		render: FormLoad,
		formupdated: FormLoad
	})
})();

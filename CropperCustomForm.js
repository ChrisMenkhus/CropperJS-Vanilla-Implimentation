(function (container, modelInstanceId) {
	//#region Initialize Variables
	var selectorId = 'ctrl_' + modelInstanceId.replace(/-/g, '_')
	var imgElement
	var cropper
	var cropped = ''
	var original = ''
	var isSaving = false
	//#endregion


	//#region Initialize Form
	function LoadForm() {
		InitImage()
		InitSaveButton()
		InitCropper()
	}


	function InitImage() {
		imgElement = document.getElementById(selectorId + '_PICTURE_value').getElementsByTagName('img')[0]
		imgElement.addEventListener('load', InitCropper, false)
	}


	function InitSaveButton() {
		/* Removes blackbaud event listeners from save button */
		var saveButtonContainerElement = document.querySelector('#dataformdialog_' + modelInstanceId + ' ' + '.x-toolbar-right-ct' + ' ' + '.bbui-buttons-primary')
		saveButtonContainerElement.replaceWith(saveButtonContainerElement.cloneNode(true))

		var saveButtonElement = document.querySelector('#dataformdialog_' + modelInstanceId + ' .x-toolbar-right-ct .x-toolbar-cell table')

		saveButtonElement.addEventListener('click', SaveCropper)
		saveButtonElement.addEventListener('mouseenter', function () {
			saveButtonElement.classList.add('x-btn-over')
		})
		saveButtonElement.addEventListener('mouseleave', function () {
			saveButtonElement.classList.remove('x-btn-over')
		})
	}


	function InitCropper() {
		if (cropper !== undefined) {
			cropper.destroy()
		}
		cropper = new Cropper(imgElement, {
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
		if (isSaving) return
		if (cropper == undefined) return

		isSaving = true

		var croppedPictureField = container.getFieldByName("CROPPEDPICTURE", modelInstanceId)
		var originalPictureField = container.getFieldByName("ORIGINALPICTURE", modelInstanceId)

		var croppedCanvas = getCanvas()
		cropped = croppedCanvas?.toDataURL('image/jpeg', 0.9)

		var uncroppedCanvas = getCanvas(true)
		original = uncroppedCanvas?.toDataURL('image/jpeg', 0.9)

		function isImgSrcValid() {
			return checkIfValid(cropped) && checkIfValid(original)
		}

		function isFieldsValid() {
			isCroppedValid = checkIfValid(croppedPictureField.value)
			isOriginalValid = checkIfValid(originalPictureField.value)
			return isCroppedValid && isOriginalValid
		}

		TickTimerConditionalCallback(250, 8, isImgSrcValid, function () {
			UpdateContainer(cropped, original)
		})

		TickTimerConditionalCallback(250, 32, isFieldsValid, function () {
			container.confirmForm()
			isSaving = false;
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


	//#region Utility Functions
	function TickTimerConditionalCallback(timerLength, maxAmountOfAttempts, conditional, callback) {
		var amountOfAttempts = 1

		var interval = setInterval(function () {
			if (amountOfAttempts <= maxAmountOfAttempts) {
				amountOfAttempts++

				if (conditional()) {
					callback()
					clearInterval(interval)
				}
			}
			else {
				clearInterval(interval)
			}
		}, timerLength)
	}


	function checkIfValid(value) {
		return value !== null && value !== undefined && value != ''
	}


	function getCanvas(shouldClearCanvas = false) {
		if (shouldClearCanvas) {
			cropper.clear()
		}

		return cropper.getCroppedCanvas()
	}
	//#endregion


	container.on({
		render: LoadForm,
		formupdated: LoadForm
	})
})();

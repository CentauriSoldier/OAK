//original code created by https://www.script-tutorials.com/pure-html5-file-upload/, modified by James Jones
var Upload = {

	// common variables
	iMegabytesToBytesMultiplier: 	1048576,
	iBytesUploaded: 			 	0,
	iBytesTotal: 					0,
	iPreviousBytesLoaded: 			0,
	iMaxFilesize: 					0,
	oTimer: 						0,
	sResultFileSize: 				'',
	nUpdateInterval: 				0,


	abort: function(e) { // upload abort
		this.showError('The upload has been canceled by the user or the browser dropped the connection.<br/>' + e);
		clearInterval(this.oTimer);
	},


	bytesToMB: function(bytes) {
		var sizes = ['Bytes', 'KB', 'MB'];
		if (bytes == 0) return 'n/a';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
	},


	cleanupDisplay: function() {
		// cleanup all temp states
		this.iPreviousBytesLoaded = 0;
		document.getElementById('upload_response').style.display = 'none';

		//clear the progress bar and hide it
		this.progressBarSetValue('0');
		this.progressBarSetVisible(false);

		//TODO HIDE THE OLD FILE TEXT
		//TODO show
		this.hideError();
	},


	doInnerUpdates: function() { // we will use this function to display upload speed
		var iCB = this.iBytesUploaded;
		var iDiff = iCB - this.iPreviousBytesLoaded;
		// if nothing new loaded - exit
		if (iDiff == 0)
			return;
		this.iPreviousBytesLoaded = iCB;
		iDiff = iDiff * 2;
		var iBytesRem = this.iBytesTotal - this.iPreviousBytesLoaded;
		var secondsRemaining = iBytesRem / iDiff;
		// update speed info
		var iSpeed = iDiff.toString() + 'B/s';
		if (iDiff > 1024 * 1024) {
			iSpeed = (Math.round(iDiff * 100/(1024*1024))/100).toString() + 'MB/s';
		} else if (iDiff > 1024) {
			iSpeed =  (Math.round(iDiff * 100/1024)/100).toString() + 'KB/s';
		}
		document.getElementById('speed').innerHTML = iSpeed;

	},


	error: function(e) { // upload error
		this.showError(e);
		clearInterval(this.oTimer);
	},


	fileSelected: function(objImageFile) {
		//tidy up before starting
		this.cleanupDisplay();

		// get selected file element
		var imageFile = document.getElementById('inpFileUpload');
		var oFile = objImageFile.files[0];

		// filter for files
		var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff|video\/ogg|video\/webm|video\/mp4)$/i;

		//check that the file is valid. auto-start the upload if it is, otherwise show error messages
		if (! rFilter.test(oFile.type)) {
			this.showError('The selected file type is not valid.');

		} else if (oFile.size > this.iMaxFilesize) {
			this.showError('The selected file\'s size (' + Math.round(oFile.size / this.iMegabytesToBytesMultiplier).toFixed(2) + ' Megabytes) exceeds the maximum allowed file size of ' + Math.round(this.iMaxFilesize / this.iMegabytesToBytesMultiplier).toFixed(2) + ' Megabytes.');

		} else {
			this.start();

		}
	},


	finish: function(e) { // upload successfully finished
		var oUploadResponse = document.getElementById('upload_response');
		oUploadResponse.innerHTML = e.target.responseText;
		oUploadResponse.style.display = 'block';
		document.getElementById('upload_response');
		//clear and hide the progress bar
		//Upload.progressBarSetValue('100');
		setTimeout(1200);
		//Upload.progressBarSetValue('0');
		//Upload.progressBarSetVisible(false);

		document.getElementById('filesize').innerHTML = this.sResultFileSize;

		clearInterval(this.oTimer);
	},


	hideError: function() {
		var sDivError = document.getElementById('divError');
		sDivError.style.display = 'none';
		sDivError.innerHTML = '';
	},


	//this must be called on page load before any other function are called
	init: function(nUpdateInterval, nMaxFileSize) {
		this.nUpdateInterval = nUpdateInterval;
		this.iMaxFilesize = nMaxFileSize * this.iMegabytesToBytesMultiplier,  nMaxFileSize; // MegaBytes * 1,048,576 = total bytes
		this.cleanupDisplay();
	},


	progress: function(e) { // upload process in progress
		if (e.lengthComputable) {
			this.iBytesUploaded = e.loaded;
			this.iBytesTotal = e.total;
			var iPercentComplete = Math.round(e.loaded * 100 / e.total);
			var iBytesTransfered = Upload.bytesToMB(this.iBytesUploaded);



			Upload.progressBarSetValue(iPercentComplete.toString());
			//var sPrgUpload = document.getElementById('prgUpload');
			//sPrgUpload.style.width = iPercentComplete.toString() + '%';
			//sPrgUpload.setAttribute('aria-valuenow', iPercentComplete.toString());


			document.getElementById('b_transfered').innerHTML = iBytesTransfered;
			if (iPercentComplete == 100) {
				var oUploadResponse = document.getElementById('upload_response');
				oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
				oUploadResponse.style.display = 'block';
			}
		} else {
			//document.getElementById('progress').innerHTML = 'unable to compute';
		}
	},


	progressBarSetValue: function(sValue) {
		var sPrgUpload = document.getElementById('prgUpload');
		sPrgUpload.style.width = sValue + '%';
		sPrgUpload.setAttribute('aria-valuenow', sValue);
	},


	progressBarSetVisible: function(bFlag) {
		//document.getElementById('divProgressContainer').style.display = (bFlag === true) ? 'block' : 'none'; THIS IS NOT WORKING, it needs the default display style to be saved then reset, not forced into block mode
		//document.getElementById('prgUpload').style.display = (bFlag === true) ? 'block' : 'none';
	},


	showError: function(sError) {
		var sDivError = document.getElementById('divError');
		sDivError.style.display = 'block';
		sDivError.innerHTML = (typeof(sError) === 'string') ? sError : '';
	},


	start: function() {
		//tidy up before the start
		this.cleanupDisplay();

		//show the progress bar
		this.progressBarSetVisible(true);
		// get form data for POSTing
		//var vFD = document.getElementById('upload_form').getFormData(); // for FF3
		var vFD = new FormData(document.getElementById('frmUpload'));
		// create XMLHttpRequest object, adding few event listeners, and POSTing our data
		var oXHR = new XMLHttpRequest();
		oXHR.upload.addEventListener('progress', this.progress, false);
		oXHR.addEventListener('load', this.finish, false);
		oXHR.addEventListener('error', this.error, false);
		oXHR.addEventListener('abort', this.abort, false);
		oXHR.open('POST', './php/actions/newAd.php?');
		//oXHR.onreadystatechange = function() {
		//if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			//finish("");
		//}


		oXHR.send(vFD);
		// set inner timer
		this.oTimer = setInterval(this.doInnerUpdates, 300);
	},

}
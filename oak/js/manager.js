const SCT_PROFILES_ID 		= 'sctProfiles';
const SCT_ADS_ID 			= 'sctAds';
const S_DOV_DISPLAY_VALUE	= 'spnDurationOrVolumeDisplayValue';
const S_DOV_DISPLAY_TITLE	= 'spnDurationOrVolumeDisplayTitle';
const S_SDR_DOV 			= 'sdrDurationOrVolume';
const S_INP_RENAME_AD		= 'inpRenameAd';
//const S_VDO_PLAYER				= 'vdoPlayer';
//const N_MIN_IMAGE_DURATION;
//const N_MAX_IMAGE_DURATION;
const DIV_STATUS_CLASS_PREFIX = 'alert position-fixed w-100 m-0 p-0 alert-';

var bIsVideo 		= false;
var sDefaultProfile = 'NOT SET';
var nMinAdDuration 	= -1;
var nMaxAdDuration 	= -1;


/*
Initializes the values used by all the functions.
These are retrieved by querying the php constants
in the html when the page if loaded.
*/
function initValues(theDefaultProfile, theMinAdDuration, theMaxAdDuration) {
	displayStatus('Initializing', "Setting default values.");

	if (sDefaultProfile === 'NOT SET' && typeof(theDefaultProfile) == "string" && theDefaultProfile !== "") {
		sDefaultProfile = theDefaultProfile;
	}

	if (nMinAdDuration === -1 && typeof(theMinAdDuration) == "number" && theMinAdDuration > -1) {
		nMinAdDuration = theMinAdDuration;
	}

	if (nMaxAdDuration === -1 && typeof(theMinAdDuration) == "number" && typeof(theMaxAdDuration) == "number" && theMaxAdDuration >= theMinAdDuration) {
		nMaxAdDuration = theMaxAdDuration;
	}

}


function deleteSelectedAd() {
	var sAdID 			= document.getElementById(SCT_ADS_ID).value;
	var sProfile 		= document.getElementById(SCT_PROFILES_ID).value;

	if (sProfile && sAdID && sProfile != '' && sAdID != '') {

		if (confirm("Are you sure you want to permananetly delete this ad?")) {
			var xhttp 		= new XMLHttpRequest();

			//xhttp.onreadystatechange = function() {
			//	if (this.readyState == 4 && this.status == 200) {}
			//};

			xhttp.open("Post", "./php/actions/deleteAd.php", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send('profile=' + sProfile + '&ad=' + sAdID);
		}

	}

}


function displayStatus(sType, sTitle = "", sStatus = "") {
	var sClassPrefix = DIV_STATUS_CLASS_PREFIX;
	var sClassSuffix = 'info';

	if (sType === 'danger' || sType === 'success' || sType === 'warning') {
		sClassSuffix = sType;
	}

	document.getElementById("divStatus").className 			= sClassPrefix + sClassSuffix;
	document.getElementById("txtStatusTitle").innerHTML 	= sTitle;
	document.getElementById("txtStatusMessage").innerHTML 	= sStatus;
}


/*
Used whenever an ad is loaded to determine what
the min/max values of the silder should be and also
to set the initial value based on the ad info. This
also formats the values to be more user friendly: i.e.,
converts milliseconds to seconds. The specific conversions
back to the required value needed to set actual duration
and volume is done elsewhere.
*/
function DoVSliderConfigure(sType, nDurationOrVolume) {
	//default the min and max values (used with volume)
	var nMinValue 	= 0;
	var nMaxValue 	= 100;
	var nValue 		= 0;
	var oSlider 	= document.getElementById(S_SDR_DOV);
	var oTitle 		= document.getElementById(S_DOV_DISPLAY_TITLE);
	var oValue	 	= document.getElementById(S_DOV_DISPLAY_VALUE);
	var sTitle 		= "<p>Volume:&nbsp</p>";

	if (sType == 'image') {
		nMinValue = nMinAdDuration / 1000;
		nMaxValue = nMaxAdDuration / 1000;
		nValue = nDurationOrVolume / 1000; //converting milliseconds to seconds
		sTitle 		= "<p>Duration:&nbsp</p>";

	} else if (sType == 'video') {
		nValue = nDurationOrVolume * 100; //converting decimal to an integer
		//player volume gets set by the calling function
	}

	oTitle.innerHTML 	= sTitle;
	oValue.innerHTML 	= nValue;
	oSlider.min 		= nMinValue;
	oSlider.max 		= nMaxValue;
	oSlider.value 		= nValue;
}
//TODO allow each image to have its own background color....the player must be updated to allow this change
//TODO Add the ability to copy/move an ad to another profile (without copying files)

function DoVSliderOnChange(nValue) {
	var sProfile 		= document.getElementById(SCT_PROFILES_ID).value;
	var sAd 			= document.getElementById(SCT_ADS_ID).value;
	var nAdjustedValue 	= 0;

	if (bIsVideo) {
		nAdjustedValue = nValue / 100;
	} else {
		nAdjustedValue = nValue * 1000;
	}

	writeAdValue(sProfile, sAd, "durationorvolume", nAdjustedValue);
}


function DoVSliderOnInput(nValue) {
	document.getElementById(S_DOV_DISPLAY_VALUE).innerHTML = nValue;
	//set the player volume (if this is a video)
	if (bIsVideo) {
		document.getElementById('player').volume = nValue / 100;
	}
}


function enabledAd(bFlag) {
	var sProfile 		= document.getElementById(SCT_PROFILES_ID).value;
	var sAd 			= document.getElementById(SCT_ADS_ID).value;
	var nEnabled 		= (bFlag === true) ? 1 : 0;
	//todo display status of final write
	writeAdValue(sProfile, sAd, "enabled", nEnabled);
}


function moveDown() {
	var xhttp 		= new XMLHttpRequest();
	var sAdList = document.getElementById(SCT_ADS_ID);



	console.log(sAdList);
}

function moveUp() {


}

function moveToTop() {

}




function moveToBottom() {

}


//TODO fix this, it's not reselecting the ad after refresh
function renameAd() {
	var inpRenameAd	= document.getElementById("inpRenameAd");
	var sAdText = inpRenameAd.value;

	if (sAdText !== "") {
		var sctAds 			= document.getElementById(SCT_ADS_ID);
		var sProfile 		= document.getElementById(SCT_PROFILES_ID).value;
		var sAd 			= sctAds.value;
		var nID 			= sctAds.selectedIndex;

		//write the value
		writeAdValue(sProfile, sAd, "name", sAdText);

		//clear the input text
		inpRenameAd.value = "";

		//refresh the ad list
		refreshAdSelectBox();

		//reselect the ad
		sctAds.selectedIndex = nID;

		//update the ad controls
		updateAdControls(sProfile, sAd);

	}

}


function refreshAdSelectBox() {
	var sProfile 		= document.getElementById(SCT_PROFILES_ID).value;
	var sctAds = document.getElementById(SCT_ADS_ID);
	var xhttp 		= new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var aAds = JSON.parse(this.responseText);

			//clear the profiles list
			sctAds.options.length = 0;

			//add the title option
			var oOption = document.createElement("option");

			//add each profile to the list
			for (x = 0; x < aAds.length; x++) {
				var oOption = document.createElement("option");
				oOption.text 	= aAds[x].name;
				oOption.value 	= aAds[x].uuid;
				sctAds.add(oOption, null);
			}

		}

	};

	//todo use constant paths when echoing
	xhttp.open("Post", "./php/actions/getAds.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//TODO allow sending other profiles
	xhttp.send('profile=' + sProfile);
}


function refreshProfileSelectBox() {
	var xhttp 			= new XMLHttpRequest();
	var sctProfiles	= document.getElementById(SCT_PROFILES_ID);

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//clear the profiles list
			sctProfiles.options.length = 0;

			//add the title option
			var oOption = document.createElement("option");
			oOption.text 	= "Choose...";
			oOption.value 	= sDefaultProfile;
			sctProfiles.add(oOption, null);

			//get the object back
			var aProfiles = JSON.parse(this.responseText);

			//add each profile to the list
			for (x = 0; x < aProfiles.length; x++) {
				var oOption = document.createElement("option");
				oOption.text 	= aProfiles[x];
				oOption.value 	= aProfiles[x];
				sctProfiles.add(oOption, null);
			}
		}
	};

	xhttp.open("Get", "./php/actions/getProfiles.php", true);
	//xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}


function selectAd() {
	var sAd = document.getElementById(SCT_ADS_ID).value;
	updateAdControls(document.getElementById(SCT_PROFILES_ID).value, sAd);
	displayStatus('info', '', 'Ad: "' + sAd + '"' + ' loaded.');

	//update the ad session variable
	var xhttp = new XMLHttpRequest();
	xhttp.open("Post", "./php/actions/setAd.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('ad=' + sAd);

}


//TODO remove the default value: check for profile listbox selection, check profile validity, set as default if it's bad
function selectProfile(sProfile) {
	//let the user know the profile has been loaded
	displayStatus('info', '', 'Profile: "' + sProfile + '"' + ' loaded.');

	//update the profile session variable
	var xhttp = new XMLHttpRequest();
	xhttp.open("Post", "./php/actions/setProfile.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('profile=' + sProfile);

	//refresh the ads for the profile
	refreshAdSelectBox();
}


function updateAdControls(sProfile, sAd) {
	var xhttp = new XMLHttpRequest();
	var player = document.getElementById("player");

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//get the ad details object from the php file
			var oAd = JSON.parse(this.responseText);
			//pause the player (whether it's playing or not)
			player.pause();
			//setup the Duration/Volume slider
			DoVSliderConfigure(oAd.type, oAd.durationOrVolume);
			//insert the placeholder text for renaming the ad
			document.getElementById('inpRenameAd').placeholder = oAd.name;
			//show whether or not the ad is enabled
			var bEnabled = (oAd.enabled == 1) ? true : false;
			document.getElementById('rdoAdEnabled').checked  	= bEnabled;
			document.getElementById('rdoAdDisabled').checked  	= !bEnabled;

			if (oAd.type == "image") {
				//let the other functions know that an image is loaded
				bIsVideo = false;
				//unload the last image (to prevent bleeding)
				document.getElementById('billboard').src = "";
				//load the image
				document.getElementById('billboard').src = oAd.file;
				//show the image container
				setBillboardVisibility(true);
				//hide the video container
				setPlayerVisibility(false);

			} else if (oAd.type == "video") {
				//let the other functions know that a video is loaded
				bIsVideo = true;
				//unload the image
				document.getElementById('billboard').src = "";
				//set the video source
				var videosource = document.getElementById('video_mp4');
				videosource.setAttribute('src', oAd.file);
				//set type of video
				videosource.setAttribute('type', oAd.type + '/' + oAd.ext);
				//load the video
				player.load();
				//set the volume
				player.volume = oAd.durationOrVolume;
				//hide the image container
				setBillboardVisibility(false);
				//show the video container
				setPlayerVisibility(true);
				//play the video
				player.play();
			}

		}

	}

	//todo use contsant paths when echoing
	xhttp.open("Post", "./php/actions/getAd.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('profile =' + sProfile + '&ad=' + sAd);
}


function writeAdValue(sProfile, sAdUUID, sValueName, vValue) {
	var xhttp 		= new XMLHttpRequest();

	//xhttp.onreadystatechange = function() {
	//	if (this.readyState == 4 && this.status == 200) {}
	//};

	xhttp.open("Post", "./php/actions/writeAdValue.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('profile=' + sProfile + '&ad=' + sAdUUID + '&valuename=' + sValueName + '&value=' + vValue);
}
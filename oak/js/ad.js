//this is the value that is used at the start of the ad cycle
const AD_PRESTART_VALUE = -1;
//the id of the ad that is currently being played
var currentAdID 	= AD_PRESTART_VALUE;
//stores all the ad objects for later use
var ads 			= [];
//the minimum amount of time an image may be displayed
const MIN_DURATION 	= 500;

//hides or shows the video player container
function setPlayerVisibility(theFlag) {

	if (theFlag) {
		document.getElementById('playerContainer').style.display='block';
	} else {
		document.getElementById('playerContainer').style.display='none';
	}

}


//hides or shows the image container
function setBillboardVisibility(theFlag) {

	if (theFlag) {
		document.getElementById('billboardContainer').style.display='block';
	} else {
		document.getElementById('billboardContainer').style.display='none';
	}

}


//gets the next ad in the series
function getNextAdID() {
	var ret = currentAdID + 1;

	if (ret >= ads.length) {
		ret = AD_PRESTART_VALUE;
	}

	return ret;
}


//loads an image
function loadImage(nAdID) {
	console.log("loading image: " + ads[nAdID].file);

	//unload the last image (to prevent bleeding)
	document.getElementById('billboard').src = "";

	//load the image
	document.getElementById('billboard').src = ads[nAdID].file;

	//hide the video container
	setPlayerVisibility(false);

	//show the image container
	setBillboardVisibility(true);

	//set the timer
	setTimeout(ad.loadNext, ads[nAdID].duration);
}


//loads a video
function loadVideo(theID) {
	var player = document.getElementById("player");
	var videosource = document.getElementById('video_mp4');

	player.pause();
	videosource.setAttribute('src', ads[theID].file);
	//TODO set type of video
	//videosource.setAttribute('type', ads[theID].type);
	player.load();
	player.volume = ads[theID].volume;

	//hide the image container
	setBillboardVisibility(false);

	//show the video container
	setPlayerVisibility(true);

	player.play();
}


export default class ad {


	static loadNext() {
		//determine the next ad id
		var adID = getNextAdID();

		if (adID > -1) {
			console.log("loading ad: " + adID);

			//set the current id
			currentAdID = adID;

			//TODO put an error here if no ads have been created



			//if the ad is a video
			if (ads[adID].isVideo) {
				loadVideo(adID);

			//if the ad is an image
			} else if (ads[adID].isImage) {
				loadImage(adID);

			}

		} else {
			//TODO make this optional
			location.reload(true);

		}

	}


	//creates a new ad object and stores it for later use
	constructor(theFile, theType, theDurationOrVolume) {
		console.log("creating ad: " + ads.length);

		//determines whether the file is video or image and checks the values
		if (typeof(theDurationOrVolume) == "number") {

			//this is a video
			if (theDurationOrVolume <= 1) {
				console.log("Ad #" + ads.length + " is a video.");

				if (theDurationOrVolume < 0) {
					theDurationOrVolume = 0;
				}

				this.duration 	= 0;
				this.volume		= theDurationOrVolume;
				this.isImage = false;
				this.isVideo = true;

			//this is an image
			} else if (theDurationOrVolume > 1) {
				console.log("Ad #" + ads.length + " is an image.");

				if (theDurationOrVolume < MIN_DURATION) {
					theDurationOrVolume = MIN_DURATION;
				}

				this.duration 	= theDurationOrVolume;
				this.volume		= 0;
				this.isImage = true;
				this.isVideo = false;
			}


		} else {
			//throw an error here
			console.error("'theDurationOrVolume' variable Must be a number value.");
		}

		this.file 		= theFile;
		this.type 		= theType;

		//store the ad
		ads[ads.length] = this;
	}

}
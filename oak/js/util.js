function setPlayerVisibility(theFlag) {

	if (theFlag === true) {
		document.getElementById('playerContainer').style.display='block';
	} else {
		document.getElementById('playerContainer').style.display='none';
	}

}


//hides or shows the image container
function setBillboardVisibility(theFlag) {

	if (theFlag === true) {
		document.getElementById('billboardContainer').style.display='block';
	} else {
		document.getElementById('billboardContainer').style.display='none';
	}

}


//designed to kill the session for the player and manager whenever the page is unloaded

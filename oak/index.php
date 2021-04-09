<?php
	//require the constants
	require_once($_SERVER["DOCUMENT_ROOT"] . '/php/CONSTANTS.php');

	//start the session (if not already started)
	if (session_status() == PHP_SESSION_NONE) {
		//session_set_cookie_params(0);
		session_start();
	}

	//set the mode
	$_SESSION['mode'] = MODE_PLAYER;

	//load the debugger script (must be loaded before any HTML)
	require_once(ROOT . PATH_PHP . '/debugger.php');

	//require the player code. This is done in this manner so syntax/parse errors can be caught (since they can be caught only in required/included files)
	require_once(ROOT . PATH_PHP_INCLUDES_PLAYER . '/player.php');
?>
<?php
//require the constants
require_once($_SERVER["DOCUMENT_ROOT"] . '/php/CONSTANTS.php');

//start the session (if not already started)
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}

//load the debugger script
require_once(ROOT . PATH_PHP . '/debugger.php');

//get the backup page
$sBackupPage = ($_SESSION['mode'] === MODE_MANAGER) ? 'manager.php' : 'index.php';

//check that there are errors, otherwise send the user back from whence they came
if (!isset($_SESSION['errorTitle']) || !isset($_SESSION['errorDescription'])) {
	header("Location: /" . $sBackupPage);
}


?>
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

	<title>404 HTML Tempalte by Colorlib</title>

	<!-- Google font -->
	<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,900" rel="stylesheet">

	<!-- Custom stlylesheet -->
	<link type="text/css" rel="stylesheet" href="css/error.css" />

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
		  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

</head>

<body>
	<div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>Error</h1>
			</div>
			<h2><?php 	echo $_SESSION['errorTitle'];		?></h2>
			<p><?php 	echo $_SESSION['errorDescription']	?></p>
			<a href="<?php $sBackupPage ?>">Go Back</a>
		</div>
	</div>

</body><!-- This templates was made by Colorlib (https://colorlib.com) -->

</html>

<?php
//unset the error session variables
unset($_SESSION['errorTitle']);
unset($_SESSION['errorDescription']);
?>
<?php
	if( isset($_POST['json']) && isset($_POST['mergedCountriesFilename']) ) {
		/*
		// split the data URL at the comma
		$data = explode(',', $_POST['data']);
		// decode the base64 into binary data
		$data = base64_decode(trim($data[1]));

		// create the numbered image file
		$filename = sprintf('%s%08d.jpg', $path, $_POST['i']);
		*/
		
		$filename = "../" . $_POST['mergedCountriesFilename'];
		$json = $_POST['json'];
		
		file_put_contents($filename, $json);
		
		$responseText = "JSON data saved to: " . $filename;
		
	} else {
		$responseText = "Post data empty";
	}

	echo $responseText;
?>


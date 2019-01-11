<?php
$pages = $parser->doc->getElementsByTagName('page');
$count = 0;
foreach ($pages as $page) {
	$titleNode = $parser->getNodeByName($page, "title");
	if($titleNode) {
		$title = $titleNode->nodeValue;
		// echo $title;

		$revisionNode = $parser->getNodeByName($page, "revision");
		if($revisionNode) {
			$revision = $revisionNode->nodeValue;

			$textNode = $parser->getNodeByName($revisionNode, "text");
			if($textNode) {
				$text = $textNode->nodeValue;

				$country = getCountryByTitle($countries, $title);

				// if($country[0] != "COUNTRY_NAME") {
				if($country[0] == "India") {
					// echo "Country:" . $country[0] . "\n<br>";

					$destinations = parseWikiText($text, $debug, $country[0]);

					if($destinations) {
						// echo $text;

						$string = "\t{ \"name\": \"" . $country[0] . "\", \"code\": \"" . $country[1] . "\", \"destinations\": [";

						foreach($destinations as $key => $destination) {
							$d = "\t{ \"d_name\": \"" . $destination['d_name'] . "\",
								\"visa_required\": \"" . $destination['visa_required'] . "\",
								\"visa_title\": \"" . $destination['visa_title'] . "\",
								\"notes\": \"" . $destination['notes'] . "\" }";
							// echo $d . "<br/>";
							$string .= $d;
							if($key < sizeof($destinations) - 1) {
								$string .= ",";
							}
						}

						$string .= "] }";

						array_push($countries_json, $string);

						$count++;
						// if($count >= 300) {
						// 	break;
						// }

            if($debug) echo sizeof($destinations) . ' destinations found for citizens from ' . $country[0] . '<br>';

					} else {
						echo "No destinations found in: <a href=\"" . $wikipedia_url . $country[2] . "\" target=\"_blank\">" . $title . "</a><br/>\n";
					}

				}
			}
		}

	}
}
?>

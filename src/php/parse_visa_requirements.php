<?php
error_reporting(E_ALL);


$wikipedia_export_url = "http://en.wikipedia.org/w/index.php?title=Special:Export&action=submit&pages=";
$wikipedia_url = "http://en.wikipedia.org/wiki/";

$load_from_cache = true; // else load from wikipedia, unless forced later
$wikipedia_cache_folder = "../data/wikipedia_export_cache";

$write_json_file = true;
$json_archive_folder = "../data/visa_requirements";
$json_filename = "_visa_requirements.json";

$debug = false;

$json_output = $_GET['json_output'];

require_once('class.XMLParser.php');
require_once('inc/parse_wikitext.inc.php');
require_once('inc/countries.inc.php');

if($debug) { echo sizeof($countries) . " Wikipedia pages in list.<br/>"; }


$parser = new XMLParser();
$parser->debug = false;

date_default_timezone_set('Europe/Berlin');
$time = time();
$year = date("Y", $time);
$month = date("m", $time);
$day = date("d", $time);
$hour = date("H", $time);
$minute = date("i", $time);
$wikipedia_cache_filename = $wikipedia_cache_folder . "/" . $year . "-" . $month . "-" . $day . "_Visa_requirements_by_nationality.xml";

// force archive update, if current archive file doesn't exist:
if(!file_exists($wikipedia_cache_filename)) {
	$load_from_cache = false;
}

if(file_exists($wikipedia_cache_filename) && $load_from_cache) {
	$export_xml_string = file_get_contents($wikipedia_cache_filename);

} else {
	$doc = new DOMDocument('1.0');
	$doc->formatOutput = true;

	$root = $doc->createElement('pages');
	$root = $doc->appendChild($root);

	$created = $doc->createAttribute('created');
	$created->value = date("c", $time);
	$root->appendChild($created);

	foreach ($countries as $country) {
		$pagename = $country[2];
		$export_url = $wikipedia_export_url . urlencode($pagename);
		if($debug) echo "Exporting pages from Wikipedia: " . $export_url . "<br/><br/>";

		if(!$xml = file_get_contents($export_url)) {
			echo "Error loading pages from Wikipedia";
		}

		$parser->loadXML($xml);
		$pages = $parser->doc->getElementsByTagName('page');
		foreach ($pages as $page) {
			// Import the node, and all its children, to the document
			$page = $doc->importNode($page, true);
			// And then append it to the "<root>" node
			$root->appendChild($page);
		}

		// duplicates check:
		$count = 0;
		foreach ($countries as $country2) {
			if($country[0] == $country2[0]) {
				$count++;
			}
		}
		if($count > 1) {
		   echo "Error: duplicate found in countries list: " . $country[0] . " ";
		}

	}
	$export_xml_string = $doc->saveXML();

	if(!file_exists($wikipedia_cache_filename)) {
		file_put_contents($wikipedia_cache_filename, $export_xml_string);
		echo "<br>Wikipedia cache XML file saved to: '" . $wikipedia_cache_filename . "'.<br/>";
	}
	
}

$json_contents = "{\n\t\"created\": \"" . date("c", $time) . "\",\n\t\"type\": \"VisaRequirements\",\n\t\"countries\": [\n";

$parser->loadXML($export_xml_string);

$countries_json = array();

require_once('inc/parse_wikipedia_export_xml.inc.php');

echo "Visa requirements loaded for " . sizeof($countries_json) . " countries.";

foreach ($countries_json as $key => $country_json) {
	$json_contents .= $country_json;
   	if($key < sizeof($countries_json) - 1) {
		$json_contents .= ",\n\n";
	}
}

$json_contents .= "\t]\n}";


if($write_json_file) {
	$json_archivefilename = $json_archive_folder . "/" . $year . "-" . $month . "-" . $day . "_" . $hour . "." . $minute . $json_filename;
	if(!file_exists($json_archivefilename)) {
		file_put_contents($json_archivefilename, $json_contents);
		echo "<br>Archive JSON file saved to: '" . $json_archivefilename . "'.<br/>";
	}
	
}
if($json_output) {
	header('Content-Type: application/json');
	echo $json_contents;
}
if($debug) {
	echo "<br>" . sizeof($destinations) . " destinations loaded<br/>";
}




function getSubString($str, $start_string, $end_string) {
	$start = stripos($str, $start_string) + strlen($start_string);
	return substr($str, $start, stripos($str, $end_string) - $start);
}

function cleanURLs($url) {
  $U = explode(' ',$url);

  $W =array();
  foreach ($U as $k => $u) {
    if (stristr($u,'http') || (count(explode('.',$u)) > 1)) {
      unset($U[$k]);
      return cleanURLs( implode(' ',$U));
    }
  }
  return implode(' ',$U);
}

function getCountryByTitle($countries, $title) {
	foreach ($countries as $country) {
   		if($country[2] == str_replace(" ", "_", $title)) {
   			return $country;
   		}
	}
}


?>
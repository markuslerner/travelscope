<?php
error_reporting(E_ERROR);

require __DIR__ . '/../../vendor/autoload.php';
$dotenv = new Dotenv\Dotenv(__DIR__ . '/../../');
$dotenv->load();

if(!isset($_GET['n']) || $_GET['n'] !== getenv('SCRIPT_NONCE')) {
  http_response_code(403);
  die('Access not allowed');
}

// settings:
$wikipedia_export_url = "http://en.wikipedia.org/w/index.php?title=Special:Export&action=submit&pages=";
$wikipedia_url = "http://en.wikipedia.org/wiki/";
$data_folder = '../data';
$wikipedia_cache_folder = $data_folder . "/wikipedia_export_cache";
$json_archive_folder = $data_folder . "/visa_requirements";
$json_filename = "_visa_requirements.json";
$write_json_file = true; // true
$load_from_cache = true; // true, else load from wikipedia, unless forced later
$debug = false; // false
$debug_print_json = false;



if(!file_exists($data_folder)) mkdir($data_folder);
if(!file_exists($wikipedia_cache_folder)) mkdir($wikipedia_cache_folder);
if(!file_exists($json_archive_folder)) mkdir($json_archive_folder);

require_once('class.XMLParser.php');
require_once('inc/parse_wikitext.inc.php');
require_once('inc/countries.inc.php');

echo sizeof($countries) . " Wikipedia pages in list.<br/>\n";


$parser = new XMLParser();
$parser->debug = false;

date_default_timezone_set('Europe/Berlin');
$time = time();
$year = date("Y", $time);
$month = date("m", $time);
$day = date("d", $time);
$hour = date("H", $time);
$minute = date("i", $time);

// minutely file:
// $wikipedia_cache_filename = $wikipedia_cache_folder . "/" . $year . "-" . $month . "-" . $day . "_" . $hour . "." . $minute . "_Visa_requirements_by_nationality.xml";

// hourly file:
$wikipedia_cache_filename = $wikipedia_cache_folder . "/" . $year . "-" . $month . "-" . $day . "_" . $hour . "_Visa_requirements_by_nationality.xml";

// daily file:
// $wikipedia_cache_filename = $wikipedia_cache_folder . "/" . $year . "-" . $month . "-" . $day . "_Visa_requirements_by_nationality.xml";

// force archive update, if current archive file doesn't exist:
if(!file_exists($wikipedia_cache_filename)) {
	$load_from_cache = false;
}

echo 'Loading data from cache: ' . ($load_from_cache ? 'true' : 'false') . "<br/>\n";

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
		if($debug) echo "Exporting pages from Wikipedia: " . $export_url . "<br/><br/>\n\n";

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
		echo "<br><b>Wikipedia cache XML file saved to: '" . $wikipedia_cache_filename . "'.</b><br/>\n\n";
	}

}

$json_contents = "{\n\t\"created\": \"" . date("c", $time) . "\",\n\t\"type\": \"VisaRequirements\",\n\t\"countries\": [\n";

$parser->loadXML($export_xml_string);

$countries_json = array();

require_once('inc/parse_wikipedia_export_xml.inc.php');

echo "<b>Visa requirements loaded for " . sizeof($countries_json) . " countries.</b><br>\n";

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
		echo "<b>Archive JSON file saved to: '" . $json_archivefilename . "'.</b><br/>\n";
	}

}
if($debug_print_json) {
	header('Content-Type: application/json');
	echo $json_contents;
}


function getSubString($str, $start_string, $end_string) {
	$start = stripos($str, $start_string) + strlen($start_string);
	return substr($str, $start, stripos($str, $end_string) - $start);
}


function getSubStringAfter($str, $start_string) {
	$start = stripos($str, $start_string) + strlen($start_string);
	return substr($str, $start);
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

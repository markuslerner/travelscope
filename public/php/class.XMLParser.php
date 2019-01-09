<?php
/*
============================================================================
XMLParser Class
2006-06-02

Markus Lerner
http://www.markuslerner.com

converted from XMLParser.as
============================================================================
*/

if(substr(phpversion(), 0, 1) > 4) {
	require_once("class.XMLParserPHP5.php");
} else {
	require_once("class.XMLParserPHP4.php");
}

/*
header("Content-type: text/html; charset=UTF-8");

$myParser = new XMLParser();
$myParser->debug = false;
$myParser->load('main.xml');

$main = $myParser->getNodeByName($myParser->getRoot(), 'test');
echo $myParser->getAttributeValueByName($myParser->getRoot(), 'language');
*/


?>
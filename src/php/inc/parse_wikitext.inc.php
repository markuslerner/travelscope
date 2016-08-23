<?php

function getAllRows($text, $start_string) {
	$start_index = 0;
	$all_rows = array();
	
	for($i = 0; $i < 100; $i++) {
		if(stripos($text, $start_string) > -1) {
			$start = stripos($text, $start_string) + strlen($start_string) + 3;
			$table = substr($text, $start);
			$end = stripos($table, "|}");
			$table = substr($text, $start, $end);
			// echo $table;
			$table = strip_tags($table);
			$rows = spliti("\\|\-", $table);
			
			$all_rows = array_merge($all_rows, $rows);
			$text = substr($text, $start_index);
			$start_index = $end;
		}
	}
	
	return $all_rows;
}

function getRows($text, $start_index, $start_string) {
	if(stripos($text, $start_string) > -1) {
		$start = stripos($text, $start_string) + strlen($start_string) + 3;
		$table = substr($text, $start);
		$end = stripos($table, "|}");
		$table = substr($text, $start, $end);
		// echo $table;
		$table = strip_tags($table);
		$rows = spliti("\\|\-", $table);
		return $rows;
	} else {
		return null;
	}
}

function containsString($needle, $haystack) {
	// return preg_match("/\b" . preg_quote($needle) . "\b/i", $haystack);
	return stripos($haystack, $needle) !== false;
}

function parseWikiText($text, $debug, $country_name) {
	// echo "parseWikiText()";
	
	// $start_string = "== Visa requirements ==\n\n{| class=\"sortable wikitable\"";

	$start_string = "{| class=\"sortable wikitable\"";
	$rows = getAllRows($text, $start_string);

	if($country_name == "Germany") {
		$start_string = "{| class=\"wikitable\"";
		$rows2 = getAllRows($text, $start_string);
		$rows = array_merge($rows, $rows2);
	}
	
	if(sizeof($rows) > 0) {
		$destinations = array();

		$rowID = 0;
		foreach($rows as $row) {
			if($debug) echo "<br/><br/>ROW " . $rowID . ": " . $row . "\n<br><br>";
	
			if($rowID > 0) {
				$cols = spliti("\n\\| ", $row);
				// $cols = explode(" |", $row);
				// $cols = preg_split('/\|+/', $row);

				$data = array();
	
				$colID = 0;
				foreach($cols as $col) {
					if($debug) echo "COL " . $colID . ": " . $col . "<br>";
	
					if($colID == 1) {
						$data['d_name'] = trim(getSubString($col, "{{flag|", "}}"));
						
						if(stripos($data['d_name'], "|") > -1) {
							$split = spliti("\\|", $data['d_name']);
							$data['d_name'] = $split[0];
						}
				
						if($debug) echo "d_name: " . $data['d_name'] . "<br>";
			
					} else if($colID == 2) {

						$data['visa_required'] = getSubString($col, "{{", "}}");
				

						// if(stripos($col, "Visa required") > -1) {
						if ( containsString("{{no|", $col) ) {
							$data['visa_required'] = "yes";

						// } else if(stripos($col, "free|{{sort|EU|Visa not required") > -1) {
						} else if ( containsString("{{free|{{sort|EU|Visa not required", $col) ) {
							$data['visa_required'] = "free-eu";
						
						} else if ( containsString("{{yes2|", $col) ) {
							$data['visa_required'] = "special";

						// } else if(stripos($col, "Visa on arrival") > -1) {
						} else if ( containsString("Visa on arrival", $col) ) {
							$data['visa_required'] = "on-arrival";
							
						// } else if(stripos($col, "eVisitor") > -1) {
						} else if ( containsString("evisitor", $col) ) {
							$data['visa_required'] = "evisitor";
							
						// } else if(stripos($col, "eVisa") > -1) {
						} else if ( containsString("evisa", $col) ) {
							$data['visa_required'] = "evisa";

						// } else if(stripos($col, "Electronic Travel Authorization") > -1) {
						} else if ( containsString("Electronic Travel Authorization", $col) ) {
							$data['visa_required'] = "eta";
							
						// } else if(stripos($col, "eta") > -1) {
						} else if ( containsString("eta", $col) ) {
							$data['visa_required'] = "eta";
							
						// } else if(stripos($col, "Admission refused") > -1) {
						} else if ( containsString("Admission refused", $col) ) {
							$data['visa_required'] = "admission-refused";
							
						// } else if(stripos($col, "Visa not required") > -1) {
						} else if ( containsString("Visa not required", $col) ) {
							$data['visa_required'] = "no";
							
						// } else if(stripos($col, "free") > -1) {
							// } else if ( containsString("free", $col) ) {
							// $data['visa_required'] = "no";
						}
						
						
						// replace line breaks:
						$data['visa_required'] = str_replace(array("\r\n", "\r", "\n"), "", $data['visa_required']);
						$data['visa_required'] = trim($data['visa_required']);
				
						if($debug) {
							echo "<span style=\"color: red;\">visa_required: " . $data['visa_required'] . "</span><br>";
						}
			
					} else if($colID == 3) {
						$data['notes'] = $col;
						$data['notes'] = str_replace("[[", "", $data['notes']);
						$data['notes'] = str_replace("]]", "", $data['notes']);
						$data['notes'] = str_replace("\n", "", (htmlspecialchars(trim(cleanURLs($data['notes'])))));
			
						if($debug) {
							echo "notes: " . $data['notes'] . "<br>";
						}
			
					}
		
					$colID++;
				} // end foreach cols
		
				if($data['d_name'] != "") {
					$found = false;
					foreach($destinations as $d) {
						if($d['d_name'] == $data['d_name']) {
							$found = true;
							break;
						}
					}
					if(!$found) {
						array_push($destinations, $data);
					}
					
				}
		
			} // end if
			$rowID++;
		}
	
		return $destinations;
	} else {
		return null;
	}
}

?>

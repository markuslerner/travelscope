<?php

function getAllRows($text, $start_string)
{
    $start_index = 0;
    $all_rows = array();

    if (stripos($text, $start_string) > -1) {
        $start = stripos($text, $start_string) + strlen($start_string) + 3;
        $table = substr($text, $start);
        $end = stripos($table, "|}");
        $table = substr($text, $start, $end);
        // echo $table;

        $table = strip_tags($table);
        $rows = explode("|-", $table);

        $all_rows = array_merge($all_rows, $rows);
        $text = substr($text, $start_index);
        $start_index = $end;
    }

    return $all_rows;
}

function getRows($text, $start_index, $start_string)
{
    if (stripos($text, $start_string) > -1) {
        $start = stripos($text, $start_string) + strlen($start_string) + 3;
        $table = substr($text, $start);
        $end = stripos($table, "|}");
        $table = substr($text, $start, $end);
        // echo $table;
        $table = strip_tags($table);
        $rows = explode("|-", $table);
        return $rows;
    } else {
        return null;
    }
}

function containsString($needle, $haystack)
{
    // return preg_match("/\b" . preg_quote($needle) . "\b/i", $haystack);
    return stripos($haystack, $needle) !== false;
}

function parseWikiText($text, $debug, $country_name)
{
    if ($debug) {
        echo "parseWikiText() " . $country_name . "<br>";
    }

    // $start_string = "== Visa requirements ==\n\n{| class=\"sortable wikitable\"";

    // fix double arrows:
    $text = str_replace("<<", "<", $text);
    $text = str_replace(">>", ">", $text);

    // fix | at the end:
    $text = str_replace("|}}", "}}", $text);

    $start_string = "class=\"sortable wikitable\"";
    $rows = getAllRows($text, $start_string);

    if (sizeof($rows) == 0) {
        $start_string = "class=\"wikitable sortable\"";
        $rows = getAllRows($text, $start_string);
    }

    if (sizeof($rows) == 0) {
        $start_string = "class=\"wikitable sortable mw-collapsible mw-collapsed\"";
        $rows = getAllRows($text, $start_string);
    }

    // load info for territories (not used yet, because many pages still don't have this info in tabular form):
    // $start_string = "{| class=\"wikitable\"";
    // $rows2 = getAllRows($text, $start_string);
    // $rows = array_merge($rows, $rows2);

    // print_r($rows);

    if (sizeof($rows) > 0) {
        $destinations = array();

        $rowID = 0;
        foreach ($rows as $row) {
            if ($debug) {
                echo "<br/><br/>ROW " . $rowID . ": " . $row . "\n<br><br>";
            }

            if ($rowID > 0) {
                // $cols = explode("\n| ", $row);
                preg_match_all('/\{+.*?\}+|^[\s|\s]/', $row, $matches);

                if (count($matches) > 0) {
                    $cols = $matches[0];
                    $data = array();
                    $colID = 0;

                    foreach ($cols as $col) {
                        if ($debug) {
                            echo "COL " . $colID . ": " . $col . "<br>";
                        }

                        if ($colID == 1) {
                            if (stripos($col, 'flagu') !== false) {
                                $data['d_name'] = trim(getSubString($col, "{{flagu|", "}}"));
                            } else if (stripos($col, 'flag') !== false) {
                                $data['d_name'] = trim(getSubString($col, "{{flag|", "}}"));
                            }

                            if (stripos($data['d_name'], "|") > -1) {
                                // $split = spliti("\\|", $data['d_name']);
                                $split = explode("|", $data['d_name']);
                                $data['d_name'] = $split[0];
                            }

                            if ($debug) {
                                echo "d_name: " . $data['d_name'] . "<br>";
                            }

                        } else if ($colID == 2) {

                            $data['visa_required'] = getSubString($col, "{{", "}}");
                            $data['visa_title'] = '';
                            if (stripos($data['visa_required'], '|') > -1) {
                                $data['visa_title'] = getSubStringAfter($data['visa_required'], "|");
                                $data['visa_title'] = str_replace(array("[[", "]]"), "", $data['visa_title']);
                                $data['visa_title'] = preg_replace("/\r|\n/", "", $data['visa_title']); // remove line breaks
                                if (stripos($data['visa_title'], '|') > -1) {
                                    // $parts = spliti("\\|", $data['visa_title']);
                                    $parts = explode("|", $data['visa_title']);
                                    if (sizeof($parts) > 0) {
                                        $data['visa_title'] = $parts[sizeof($parts) - 1];
                                    }
                                }
                            }
                            if ($debug) {
                                echo 'visa_title: ' . $data['visa_title'] . "<br>";
                            }

                            if (containsString("{{no|", $col)) {
                                $data['visa_required'] = "yes";

                            } else if (containsString("yes|√", $col)) {
                                $data['visa_required'] = "yes";

                            } else if (containsString("yes|[[Visa Waiver Program]]", $col)) {
                                $data['visa_required'] = "yes";

                            } else if (containsString("yes|Visa required", $col)) {
                                $data['visa_required'] = "yes";

                            } else if (containsString("{{yes-no|", $col)) {
                                $data['visa_required'] = "on-arrival";

                            } else if (containsString("{{free|{{sort|EU|Visa not required", $col)) {
                                $data['visa_required'] = "free-eu";

                            } else if (containsString("{{free|{{sort|EU|Freedom of movement", $col)) {
                                $data['visa_required'] = "free-eu";

                            } else if (containsString("{{yes2|", $col)) {
                                $data['visa_required'] = "eta";

                            } else if (containsString("on-arrival", $col)) {
                                $data['visa_required'] = "on-arrival";

                            } else if (containsString("on arrival", $col)) {
                                $data['visa_required'] = "on-arrival";

                            } else if (containsString("yes|Free Visitor", $col)) {
                                $data['visa_required'] = "on-arrival";

                            } else if (containsString("yes|Free Entry", $col)) {
                                $data['visa_required'] = "on-arrival";

                            } else if (containsString("evisitor", $col)) {
                                $data['visa_required'] = "eta";

                            } else if (containsString("evisa", $col)) {
                                $data['visa_required'] = "eta";

                            } else if (containsString("Electronic Travel Authorization", $col)) {
                                $data['visa_required'] = "eta";

                            } else if (containsString("eta", $col)) {
                                $data['visa_required'] = "eta";

                            } else if (containsString("yes|Free e-Visa", $col)) {
                                $data['visa_required'] = "eta";

                            } else if (containsString("Admission refused", $col)) {
                                $data['visa_required'] = "admission-refused";

                            } else if (containsString("Travel banned", $col)) {
                                $data['visa_required'] = "admission-refused";

                            } else if (containsString("Visa not required", $col)) {
                                $data['visa_required'] = "no";

                            }

                            // replace line breaks:
                            $data['visa_required'] = str_replace(array("\r\n", "\r", "\n"), "", $data['visa_required']);
                            $data['visa_required'] = trim($data['visa_required']);

                            if ($debug) {
                                echo "<span style=\"color: red;\">visa_required: " . $data['visa_required'] . "</span><br>";
                            }

                        } else if ($colID == 3) {
                            $data['notes'] = $col;
                            $data['notes'] = str_replace("[[", "", $data['notes']);
                            $data['notes'] = str_replace("]]", "", $data['notes']);
                            $data['notes'] = trim($data['notes']);
                            if ($data['notes'] == '|') {
                                $data['notes'] = '';
                            }

                            // $data['notes'] = str_replace("|", ", ", $data['notes']);
                            $data['notes'] = join(', ', array_filter(explode('|', $data['notes'])));
                            $data['notes'] = str_replace("colspan=2 , ", "", $data['notes']);
                            $data['notes'] = str_replace("\n", "", (htmlspecialchars(cleanURLs($data['notes']))));

                            // if($debug) echo "notes: " . $data['notes'] . "<br>";

                        }

                        $colID++;
                    } // end foreach cols

                    if ($data['d_name'] != "" && strpos($data['d_name'], 'text-align') === false) {
                        $found = false;
                        foreach ($destinations as $d) {
                            if ($d['d_name'] == $data['d_name']) {
                                $found = true;
                                break;
                            }
                        }
                        if (!$found) {
                            array_push($destinations, $data);
                        }

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

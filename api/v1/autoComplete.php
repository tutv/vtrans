<?php

header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");

$text = $_GET["t"];

if (!isset($text)) {
    echoResult(false);
} else {
    include("Unirest.php");

    $url = "http://dictionary.cambridge.org/autocomplete/learner-english/?q=" . $text . "&contentType=application/json;charset=utf-8";

    $content = Unirest\Request::get($url, null, null);

    if ($content->code != "200") {
        echoResult(false);
    } else {
        $body = $content->raw_body;
        $list = json_decode($body)->results;

        $length = count($list);

        $result = array();
        $count = 0;
        for ($i=0; $i<$length; $i++) {
            $searchText = $list[$i]->searchtext;
            if (str_word_count($searchText) == 1 && $text != $searchText) {
                array_push($result, $searchText);
                $count++;
            }
        }

        if ($count == 0) {
            echoResult(false);
        } else {
            echoResult(true, $result);
        }
    }

}

function echoResult($s, $arr = null) {
    echo json_encode(array("status" => $s, "result" => $arr));
}

?>
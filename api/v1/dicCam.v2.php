<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");
$text = $_POST['t'];
if (!isset($text)) {
    echoResult(false);
    return;
}

include("Unirest.php");

$url = "http://dictionary.cambridge.org/search/learner-english/direct/?q=" . $text;

$content = Unirest\Request::get($url, null, null);
$status = $content->code;
$location = $content->headers["Location"];
if ($status != "200") {
    echoResult(false);
}
else if (strpos($location, "spellcheck") != false) {
    echoResult(false);
}
else {
    $bodyContent = $content->raw_body;

    ////////////////////////////
    //Tach lay tung phan tu
    // Get word
    $temp = explode("cdo-section-title-hw\">", $bodyContent)[1];
    $word = explode("</h2>", $temp)[0];

    //Get Type word
    $temp = explode("posgram\">", $bodyContent)[1];
    $temp = explode("<div", $temp)[0];
    $temp = explode("</span>", $temp)[0];
    $temp .= "</span>";
    $typeWord = $temp;

    //Get audio
    $arrTemp = explode("data-src-mp3=\"", $bodyContent);
    $temp1 = $arrTemp[1];
    $temp2 = $arrTemp[2];
    $audioUK = explode("\"", $temp1)[0];
    $audioUS = explode("\"", $temp2)[0];

    // Get Transcribe
    $temp = explode("pron-us-->\n", $bodyContent)[1];
    $transcribe = explode("<div", $temp)[0];

    echoResult(true, $word, $typeWord, $transcribe, $audioUK, $audioUS);
}

function echoResult($s, $w = null, $type = null, $tr = null, $au1 = null, $au2 = null) {
    print_r(json_encode(array("status" => $s, "word" => $w, "type" => $type, "trans" => $tr, "auUK" => $au1, "auUS" => $au2)));
}
?>
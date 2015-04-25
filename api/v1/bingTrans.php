<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");
$text = $_POST["t"];

if (!isset($text)) {
    echoResult(false);
}
else {
    include("Unirest.php");

    $appID = "TYhZomhAwueS6k7vgtnwD-E3sqlHHs1_RqVAdJE8tB_mg_nV8W1oTCtdBUC51Ouvw";
    $text = str_replace("\"", "", $text);
    $url = "http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2?appId=\"" . $appID . "\""
        . "&texts=[\"" . urlencode($text) . "\"]&from=\"en\"&to=\"vi\"&options={}&onerror=onError_5&_=1429904869822";

    $content = Unirest\Request::get($url, null, null);

    if ($content->code != "200") {
        echoResult(false);
    } else {
        $body = $content->raw_body;
        $temp = explode("TranslatedText\":\"", $body)[1];
        $trans = explode("\",\"", $temp)[0];
        echoResult(true, $trans);
    }
}

function echoResult($s, $t = null) {
    echo json_encode(array("status" => $s, "trans" => $t));
}

?>
<?php

header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");

$text = $_POST["t"];

if (!isset($text)) {
    echoResult(false);
} else {
    include("Unirest.php");

    $google = googleTrans($text);
    $bing = bingTrans($text);

    $status = !($google == "" && $bing == "");

    if ($status) {
        echoResult($status, $google, $bing);
    } else {
        echoResult(false);
    }

}

function echoResult($status, $google = null, $bing = null) {
    echo json_encode(array("status" => $status, "google" => $google, "bing" => $bing));
}

function googleTrans($text) {
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" . urlencode($text);

    $content = Unirest\Request::post($url, null, null);

    if ($content->code != "200") {
        return "";
    }

    $json = $content->raw_body;

    //Xóa dấu ,, thừa.
    while (strpos($json, ",,") != false) {
        $json = str_replace(",,", ",", $json);
    }

    $object = json_decode($json);
    $arrTrans = $object[0];
    $trans = "";//Khởi tạo string chứa text đã được translate

    for ($i=0; $i<count($arrTrans); $i++) {
        $trans .= $arrTrans[$i][0];
    }

    return $trans;
}

function bingTrans($text) {
    $appID = "TYhZomhAwueS6k7vgtnwD-E3sqlHHs1_RqVAdJE8tB_mg_nV8W1oTCtdBUC51Ouvw";
    $text = str_replace("\"", "", $text);
    $text = str_replace("\n", ". ", $text);
    $url = "http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2?appId=\"" . $appID . "\""
        . "&texts=[\"" . urlencode($text) . "\"]&from=\"en\"&to=\"vi\"&options={}&onerror=onError_5&_=1429904869822";

    $content = Unirest\Request::get($url, null, null);

    if ($content->code != "200") {
        return "";
    }

    $body = $content->raw_body;
    $temp = explode("TranslatedText\":\"", $body)[1];
    $trans = explode("\",\"", $temp)[0];

    return $trans;
}

?>
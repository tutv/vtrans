<?php
/**
 * Created by PhpStorm.
 * User: tu
 * Date: 22/04/2015
 * Time: 23:52
 */
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");

$texts = $_POST['t'];

if (!isset($texts)) {
    echoResult(false);
}
else {
    include("Unirest.php");

    $body = array("text_to_transcribe" => $texts, "submit" => "Show transcription",
        "output_dialect" => "am", "output_style" => "only_tr", "preBracket" => "", "postBracket" => "");
    $headers = null;
    $content = Unirest\Request::post("http://lingorado.com/ipa", $headers, $body);
    $raw = $content->raw_body;

    $temp = explode("<p>", $raw)[1];
    $temp = explode("</p>", $temp)[0];
    $arr = explode("class=\"transcribed_word\">", $temp);
    $trans = "";
    for ($i = 1; $i < count($arr); $i++) {
        $trans .= tachXau(explode("</span>", $arr[$i])[0]) . " ";
    }

    if ($trans == "") {
        echoResult(false);
    } else {
        echoResult(true, $trans);
    }
}

function tachXau($str) {
    if (explode("<a", $str)[1] == null) {
        return $str;
    }

    $temp = explode(">", $str)[1];
    $temp = explode("<", $temp)[0];
    return $temp;
}

function echoResult($s, $t = null) {
    echo json_encode(array("status" => $s, "trans" => $t));
}

?>
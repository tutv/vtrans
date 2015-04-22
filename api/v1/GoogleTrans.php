<?php
/**
 * Created by PhpStorm.
 * User: tu
 * Date: 21/04/2015
 * Time: 02:02
 */

header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");
$texts = $_GET['t'];
if (!isset($texts)) {
    echoResult(false, null);
    return;
}

include("Unirest.php");
//include("removeVNese.php");
//$texts = vn2latin($texts);//Chuyển Tiếng Việt sang không dấu

//$texts = "I can do it :] Thank,,,, to it, I can make my dream.";
$url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" . urlencode($texts);

$content = Unirest\Request::post($url, null, null);

if ($content->code != "200") {
    echoResult(false, null);
}
else {
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
    echoResult(true, $trans);
}

function echoResult($s, $t) {
    echo json_encode(array("status" => $s, "trans" => $t));
}
?>
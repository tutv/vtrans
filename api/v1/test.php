<?php
/**
 * Created by PhpStorm.
 * User: tu
 * Date: 02/05/2015
 * Time: 21:00
 */

include("Unirest.php");

$text = "Bó cánh";

$url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" . urlencode($text);

$content = Unirest\Request::post($url, null, null);

if ($content->code != "200") {
    return "";
}

$json = $content->raw_body;

print_r($json);
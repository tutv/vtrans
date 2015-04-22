<?php
/**
 * Created by PhpStorm.
 * User: tu
 * Date: 21/04/2015
 * Time: 01:57
 */

include("Unirest.php");

$text = "good";
$url = "http://dictionary.cambridge.org/search/american-english/direct/?q=" . $text;
$content = Unirest\Request::get($url, null, null);

print_r($content);

?>
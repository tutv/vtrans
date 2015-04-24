<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json; charset=UTF-8");
$ver = array("version"=> 1, "link" => "http://vtrans.ga/v1.apk");
echo json_encode($ver);
?>
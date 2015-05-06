<?php

$text = $_GET['t'];
if (!isset($text)) {
    $text = "Hello";
}
$url = "https://translate.google.com/translate_tts?ie=UTF-8&q=" . urlencode($text) . "&tl=en&total=1&idx=0&textlen="
    . str_word_count($text) . "&client=t&prev=input";
header("Location: " . $url);

?>
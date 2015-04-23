var hostAPI = "http://api.vtrans.ga/v1/";

var enTrans = $("#enTrans");
var deTrans = $("#deTrans");
var btnEn = $("#btnEn");
var audioUK;
var audioUS;

enTrans.focus(function () {
    alaEnTrans();
});

enTrans.keydown(function () {
    alaEnTrans();
});

function alaEnTrans() {
    var text = enTrans.val();
    if (text != "") {
        $("#emptyText").show();
        if (countWord(text) > 1) {
            btnEn.text("Transcribe");
            btnEn.attr("onclick", "transcribe();");
        }
        else {
            btnEn.text("Dictionary");
            btnEn.attr("onclick", "dictionary();");
        }
    }
    else {
        $("#emptyText").hide();
    }
}

$("#emptyText").click(function () {
    enTrans.val("");
    enTrans.focus();
    deTrans.html("");
    $(this).hide();
    deTrans.hide();
});

$("#bg-load").click(function () {// Giải quyết bế tắc khi load mãi éo được :3
    $("#load").hide();
});

function transcribe() {
    $("#load").show();
    var texts = $("#enTrans").val();
    $.ajax({
        url: hostAPI + "transcribe.php",
        method: "POST",
        dataType: "json",
        data: {t : texts},
        success: function (data) {
            deTrans.text(data.trans);
            $("#load").hide();
            deTrans.fadeIn();
        }
    });
}

function dictionary() {
    $("#load").show();
    var texts = $("#enTrans").val();
    $.ajax({
        url: hostAPI + "dicCam.php",
        method: "POST",
        dataType: "json",
        data: {t : texts},
        success: function (data) {
            if (data.status == true) {
                deTrans.html(createDictionary(data.word, data.type, data.trans));
                audioUK = new Audio(data.auUK);
                audioUS = new Audio(data.auUS);
                deTrans.fadeIn();
            }
            else {
                deTrans.text("Error :[");
            }
            $("#load").hide();
        }
    });
}

function googleTrans() {
    $("#load").show();
    var texts = $("#enTrans").val();

    $.ajax({
        url: hostAPI + "googleTrans.php",
        method: "POST",
        dataType: "json",
        data: {t: texts},
        success: function (data) {
            deTrans.text(data.trans);
            $("#load").hide();
            deTrans.fadeIn();
        }
    });
}

function countWord(word) {
    word = word.trim();
    if (word == "") return 0;

    while (word.indexOf("  ") >=0) {
        word = word.replace("  ", " ");
    }
    arr = word.split(" ");
    return arr.length;
}

function createDictionary(word, type, trans) {
    $temp = "";
    $temp += "<span id=\"title-word\">" + word + "</span>";
    $temp += "<span id=\"transcribe\">" + trans + "</span>";
    $temp += "<div class=\"audio\">";
    $temp += "<span id=\"typeWord\">" + type + "</span>";
    $temp += "<span id=\"auUK\" onclick=\"audioUK.play();\">UK<span class=\"glyphicon glyphicon-volume-up speakers\"></span></span>" +
    "<span id=\"auUS\" onclick=\"audioUS.play();\">US<span class=\"glyphicon glyphicon-volume-up speakers\"></span></span></div>";

    return $temp;
}

//$("#enTrans").val("English is a West Germanic language that was first spoken in early medieval England and is now a global lingua franca.[4][5] It is an official language of almost 60 sovereign states, the most commonly spoken language in the United Kingdom, the United States, Canada, Australia, Ireland, and New Zealand, and a widely spoken language in countries in the Caribbean, Africa, and southeast Asia.[6] It is the third most common native language in the world, after Mandarin and Spanish.[7] It is widely learned as a second language and is an official language of the United Nations, of the European Union, and of many other world and regional international organisations.");
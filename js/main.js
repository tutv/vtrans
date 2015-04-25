var hostAPI = "http://api.vtrans.ga/v1/";

var enTrans = $("#enTrans");
var btnEn = $("#btnEn");
var audioUK;
var audioUS;
var version = 1;

enTrans.focus(function () {
    alaEnTrans();
});

enTrans.keydown(function () {
    alaEnTrans();
});

enTrans.keyup(function () {
    alaEnTrans();
});

//$(document).ready(function () {
//    $.ajax({
//        url: hostAPI + "version.php",
//        dataType: "json",
//        success: function (data) {
//            if (version != data.version) {
//                $("#updateVersion").modal("show");
//            }
//            $("#btnUpdate").attr("href", data.link);
//        }
//    });
//});

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
    $(this).hide();
    hideResult();
});

$("#bg-load").click(function () {// Giải quyết bế tắc khi load mãi éo được :3
    stopLoad();
});

$("#translate").click(function() {
    translate();
});

function stopLoad() {
    $("#load").hide();
}

function transcribe() {
    $("#load").show();
    hideResult();
    var texts = $("#enTrans").val();
    $.ajax({
        url: hostAPI + "transcribe.php",
        method: "POST",
        dataType: "json",
        data: {t : texts},
        success: function (data) {
            if (data.status == false) {
                notifyError();
            } else {
                $("#transcribe").text(data.trans);
                $("#transcribe-result").show();
                showResult();
            }
            stopLoad();
        },
        error: function() {
            notifyError();
            stopLoad();
        }
    });
}

function dictionary() {
    $("#load").show();
    hideResult();
    var texts = $("#enTrans").val();
    $.ajax({
        url: hostAPI + "dicCam.php",
        method: "POST",
        dataType: "json",
        data: {t : texts},
        success: function (data) {
            if (data.status != true) {
                notifyError();
            }
            else {
                $("#title-word").text(data.word);
                $("#transcribe-word").html(data.trans);
                $("#typeWord").html(data.type);
                audioUK = new Audio(data.auUK);
                audioUS = new Audio(data.auUS);

                $("#dictionary-result").show();
                showResult();
            }
            stopLoad();
        },
        error: function() {
            notifyError();
            stopLoad();
        }
    });
}

function translate() {
    $("#load").show();
    hideResult();
    var texts = $("#enTrans").val();

    $.ajax({
        url: hostAPI + "translate.php",
        method: "POST",
        dataType: "json",
        data: {t: texts},
        success: function(data) {
            if (data.status == false) {
                notifyError();
            } else {
                $("#googleTrans").text(data.google);
                $("#bingTrans").text(data.bing);

                $("#translate-result").show();
                showResult();
            }
            stopLoad();
        },
        error: function() {
            notifyError();
            stopLoad();
        }
    });
}

function notifyError() {
    $("#notify-error").show();
    showResult();
}

function showResult() {
    $("#result").fadeIn();
}

function hideResult() {
    $("#result").fadeOut(500);
    $("#dictionary-result").delay(500).hide();
    $("#translate-result").delay(500).hide();
    $("#transcribe-result").delay(500).hide();
    $("#notify-error").delay(500).hide();
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
var hostAPI = "http://api.vtrans.ga/v1/";

var enTrans = $("#enTrans");
var btnEn = $("#btnEn");
var audioUK;
var audioUS;

//String.prototype.capitalize = function() {
//    return this.charAt(0).toUpperCase() + this.slice(1);
//}

enTrans.focus(function () {
    alaEnTrans();
});

enTrans.keydown(function () {
    alaEnTrans();
});

enTrans.keyup(function () {
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
    $(this).hide();

    btnEn.text("Dictionary");
    btnEn.attr("onclick", "dictionary();");
});

$("#translate").click(function() {
    translate();
});

function stopLoad() {
    $("#load").hide();
}

function startLoad() {
    $("#load").show();
}

function notifyError(type) {
    var noti = $("#error-" + type);
    noti.show();
    showResult();
}

function showResult() {
    $("#result").fadeIn();
}

function hideResult() {
    $("#result").hide();
    $("#dictionary-result").hide();
    $("#translate-result").hide();
    $("#transcribe-result").hide();
    $("#error-error").hide();
    $("#error-net").hide();
    $("#error-empty").hide();
    $("#error-notfound").hide();
}

function checkEmpty() {
    var texts = enTrans.val().trim();
    return texts == "";
}

function transcribe() {
    hideResult();
    startLoad();
    var texts = enTrans.val().trim();
    enTrans.val(texts);
    $.ajax({
        url: hostAPI + "transcribe.php",
        method: "POST",
        dataType: "json",
        data: {t : texts},
        success: function (data) {
            if (data.status == false) {
                notifyError("error");
            } else {
                $("#transcribe").text(data.trans);
                $("#transcribe-result").show();
                showResult();
            }
            stopLoad();
        },
        error: function() {
            notifyError("net");
            stopLoad();
        },
        cache: true
    });
}

function dictionary() {
    var texts = enTrans.val().trim();
    if (countWord(texts) > 1) {
        transcribe();
        alaEnTrans();
        return;
    }
    hideResult();

    if (checkEmpty()) {
        notifyError("empty");
        return;
    }

    startLoad();

    enTrans.val(texts);
    $.ajax({
        url: hostAPI + "dicCam.php",
        method: "POST",
        dataType: "json",
        data: {t : texts},
        success: function (data) {
            if (data.status == false) {
                notifyError("notfound");
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
            notifyError("net");
            stopLoad();
        },
        cache: true
    });
}

function translate() {
    hideResult();

    if (checkEmpty()) {
        notifyError("empty");
        return;
    }

    startLoad();
    var texts = enTrans.val().trim();
    enTrans.val(texts);
    $.ajax({
        url: hostAPI + "translate.php",
        method: "POST",
        dataType: "json",
        data: {t: texts},
        success: function(data) {
            if (data.status == false) {
                notifyError("error");
            } else {
                $("#googleTrans").text(data.google);
                $("#bingTrans").text(data.bing);

                $("#translate-result").show();
                showResult();
            }
            stopLoad();
        },
        error: function() {
            notifyError("net");
            stopLoad();
        },
        cache: true
    });
}

function countWord(word) {
    word = word.trim();
    if (word == "") return 0;

    while (word.indexOf("  ") >=0) {
        word = word.replace("  ", " ");
    }
    var arr = word.split(" ");
    return arr.length;
}

enTrans.textcomplete([{
    match: /\b(\w{2,})$/,
    search: function (term, callback) {
        $.ajax({
            method: "POST",
            url: "http://api.vtrans.ga/v1/autoComplete.php",
            data: {t: term},
            dataType: "json",
            success: function (data) {
                callback(data.results);
            },
            error: function () {
                callback([]);
            }
        });
    },
    index: 1,
    replace: function (word) {
        return word + ' ';
    },
    cache: true
}]);
// fonctions de l'appli
var DIESE_SERVICE = 'http://diese.pe.hu/services/';

$(function(){
    addMenuListener();
});

function dateToStr(utc){
    var date = new Date(utc);

    return date.getDate()+'/'+(date.getMonth() > 9 ? '0' : '')+date.getMonth()+'/'+date.getFullYear();
}

function askDiese(url, values, onSuccess, onError){
    console.log("Requesting " + url + ' with values ' + JSON.stringify(values));
    $.ajax({
        type      : 'POST',
        url       : DIESE_SERVICE+url+'.php',
        data      : values,
        success   : onSuccess,
        error     : onError
    });
}

function get(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}

function addMenuListener(){
    $(".nav-bar__item").click(function(){
        window.location.href=($(this).data("to"));
    });
}

function openLoading(text){
    var modal = '<ons-dialog id="loading">'
        +'<div id="loading-modal">'
        +'<div id="loading-progress">'
        +'<svg class="progress-circular">'
        +'<circle class="progress-circular__primary" cx="50%" cy="50%" r="40%" fill="none" stroke-width="10%" stroke-miterlimit="10"/>'
        +'</svg>'
        +'</div>'
        +'<p>'+text+'</p>'
        +'</div>'
        +'</ons-dialog>';

    $('body').append(modal);
    $('#loading').show();
}

function closeLoading(){
    $('#loading').hide();
}

function getUserId(){
    if(sessionStorage.userId){
        return sessionStorage.userId.length;
    } else {
        window.location.href = 'index.html';
    }
}
// fonctions de l'appli
var DIESE_SERVICE = 'http://diese.pe.hu/services/';
//var DIESE_SERVICE = 'http://diese-app.ouvaton.org/services/';

$(function(){
    console.log("Connecté avec user " + getUserId());
    addMenuListener();
});

function dateToStr(utc, format){
    var date = new Date(parseInt(utc));

    var fullDate = function(date){
        return (date.getDate() < 9 ? '0' : '')+date.getDate()+'/'+(date.getMonth()+1 < 9 ? '0' : '')+(+date.getMonth()+1)+'/'+date.getFullYear();
    };

    switch(format){
        case 'time':
            return (date.getHours() < 9 ? '0' : '')+date.getHours()+':'+(date.getMinutes() < 9 ? '0' : '')+date.getMinutes();
        case 'eventful':
            var from = utc.split(" ")[0].split("-");
            var finalDate = new Date(from[0], +from[1] - 1, from[2]);
            return fullDate(finalDate);
        default:
            return fullDate(date);
    }
}

function askDiese(url, values, onSuccess, onError, retry){
    if(!retry) retry = 1;
    console.log('Try ' + retry +' : '+ url + ' with values ' + JSON.stringify(values));

    $.ajax({
        type      : 'POST',
        url       : DIESE_SERVICE+url+'.php',
        data      : values,
        success   : onSuccess,
        error     : function(){
            if(retry < 3){
                askDiese(url, values, onSuccess, onError, retry+1);
            } else {
                onError();
            }
        }
    });
}

function askGoogleMapsCoordinates(where, callback){
    console.log("Asking Google where is " + where);
    openLoading('Vérification du lieu...');

    var onLoad = function(e){
        closeLoading();

        if(e.status == 'OK'){
            callback({
                latitude    : e.results[0].geometry.location.lat,
                longitude   : e.results[0].geometry.location.lng
            });
        } else {
            onError(e);
        }
    };

    var onError = function(e){
        console.log("Error " + e);
        return false;
    };

    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(where), {
        success: onLoad
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
    return false;
}

function toPage(page, params){
    var href = page+'.html?';

    params.from = encodeURIComponent(
        location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
        +window.location.search
    );

    for(var i in params)
        href += i+'='+params[i]+'&';

    return href;
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
    $('#loading').remove();
}

function getUserId(){
    if(window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'index.html') return;

    if(sessionStorage.userId){
        return sessionStorage.userId;
    } else {
        window.location.href = 'index.html';
    }
}
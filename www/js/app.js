// fonctions de l'appli
var DIESE_SERVICE = 'http://diese.pe.hu/services/';

function dateToStr(utc){
    var date = new Date(utc);
    var mois = [
        'janvier',      'février',  'mars',     'avril',
        'mai',          'juin',     'juillet',  'août',
        'septembre',    'octobre',  'novembre', 'décembre'
    ];

    return date.getDate()+' '+mois[date.getMonth()-1];
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

function addMenuListener(){
    $(".nav-bar__item").click(function(){
        window.location.href=($(this).data("to"));
    });
}
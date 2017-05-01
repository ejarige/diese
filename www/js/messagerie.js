$(function(){
    getMessages();

    addResponsive();
});

function getMessages(){
    openLoading('Chargement des messages...');

    var onLoad = function(e){
        var data = $.parseJSON(data);

        var mapDate = {};
        for(var i in data){
            var day = data[i].date - (data[i].date % 86400000);
            // TODO
        }
    };

    var onError = function(e){
        console.log('Erreur '+e);
    };
}

function addResponsive(){
    var vh = $(window).height()/100;
    $('#conversation').css('height', ($(window).height()-25*vh-49)+'px');
}
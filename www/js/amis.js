$(function(){
    getFriends();
    addResponsive()
});

function getFriends(){

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);

        //TODO

        $('#friends-loading').hide();
    };

    var onError = function(e){
        alert('Erreur '+ e.status);
    };

    askDiese(
        'get/friends',
        {
            user_id:28
        },
        onLoad,
        onError
    );
}

function addResponsive(){
    var vh = $(window).outerHeight()/100;
    $('#friends-list').css('height', ($(window).outerHeight()-16*vh-60)+'px');
}
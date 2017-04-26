$(function(){
    getFriends();
    addResponsive()
});

function getFriends(){
    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);

        for(var i in data){
            var item = '<div class="friends-item" id="'+data[i].id+'">'
                +'<div class="avatar" style="background-image:url('+data[i].avatar+')"></div>'
                +'<div class="name">'+data[i].login+'</div>'
                +'</div>';

            $('#friends-list').append(item);
        }

        $('.friends-item').on('click', function(){
            window.location.href = toPage('profil', {id: $(this).attr('id')});
        });

        $('#friends-loading').hide();
    };

    var onError = function(e){
        console.log('Erreur '+ e.status);
    };

    askDiese(
        'get/friends',
        {
            user_id: getUserId()
        },
        onLoad,
        onError
    );
}

function addResponsive(){
    var vh = $(window).outerHeight()/100;
    $('#friends-list').css('height', ($(window).outerHeight()-16*vh-60)+'px');
}
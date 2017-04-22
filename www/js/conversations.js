$(function(){

    getConversations();

    // TODO PAGE SCROLL
});

function getConversations(){
    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);
        updateConversationsView(data);
    };

    var onError = function(e){
        console.log("Erreur " + e);
    };

    askDiese(
        'get/conversations',
        {user_id:getUserId()},
        onLoad,
        onError
    );
}

function updateConversationsView(data){
    var list = $('#liste_conversation');
    list.html('');

    for(var i in data){
        var item = '<div class="conversation" id="'+data[i].conv_id+'">'
            +'<div class="photo_ami" style="background-image:url('+data[i].users[0].avatar+')"></div>'
            +'<p class="info-conv nom_ami">'+data[i].name+'</p>'
            +'<p class="info-conv apercu_conv">'+data[i].lastmessage+'</p>'
            +'</div>';

        list.append(item);
    }
}
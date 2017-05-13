$(function(){

    getConversations();
    addResponsive();

    // TODO PAGE SCROLL
});

function getConversations(){
    openLoading('Chargement des conversations...');
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

function updateConversationsView(data) {
    var list = $('#liste_conversation');
    list.html('');

    for (var i in data) {
        var receiverPos = data[i].users[0].id != getUserId() ? 0 : 1;
        var item = '<div class="conversation" id="' + data[i].id + '">'
            + '<div class="photo_ami" style="background-image:url(' + data[i].users[receiverPos].avatar + ')"></div>'
            + '<p class="info-conv nom_ami">' + data[i].name + ' avec ' + data[i].users[receiverPos].login + '</p>'
            + '<p class="info-conv apercu_conv">' + data[i].lastmessage[0].text + '</p>'
            + '</div>';

        list.append(item);
    }

    $('.conversation').on('click', function () {
        location.href = toPage('messagerie', {conv_id: $(this).attr('id')});
    });

    closeLoading();

}

function addResponsive() {
    var vh = $(window).height() / 100;
    $('.liste_conversation_main').css('height', ($(window).height() - 30 * vh - 149) + 'px');
}
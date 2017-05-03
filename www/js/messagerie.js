$(function(){
    var convId = get('conv_id');
    var messageType = get('type');

    if(messageType && messageType == 'new_conv'){
        getReceiverInfo();
        addNewConvListener();
    } else if(convId){
        getConv(convId);
        addConvListener();
    }

    addResponsive();
});

function getConv(convId){
    openLoading('Chargement des messages...');
    $('#conversation > *:not(#new-message-warper)').remove();

    var onLoad = function(e){
        var data = $.parseJSON(e);

        var dayMap = {};
        for(var i in data){
            var day = (data[i].date - data[i].date % 86400000);
            if(void 0 === dayMap[day]){
                dayMap[day] = [data[i]];
            } else {
                dayMap[day].push(data[i]);
            }
        }

        console.log('daymap', dayMap);

        var user = getUserId();
        var conversation = '';
        for(var d in dayMap){
            conversation += '<div class="system">'+dateToStr(d)+'</div>';
            for(var m in dayMap[d]){
                conversation += '<div class="message'
                    +(dayMap[d][m].sender_id == user ? ' sent' : ' received')
                    +'" id="'+dayMap[d][m].msg_id
                    +'">'
                    +'<div class="time">'+dateToStr(dayMap[d][m].date, 'time')+'</div>'
                    +'<div class="content">'+dayMap[d][m].text+'</div>'
                    +'</div>';
            }
        }
        $('#conversation').prepend(conversation);
        closeLoading();
    };

    var onError = function(e){
        console.log('Erreur '+e);
    };

    askDiese('get/messages', {conv_id:convId}, onLoad, onError);
}

function getReceiverInfo(){
    openLoading('Chargement...');

    var onUserLoad = function(e){
        var userData = $.parseJSON(e);

        var onConcertLoad = function(e){
            var concertData = $.parseJSON(e);

            $('.photo_profil').css('backgroundImage', 'url('+userData.avatar+')');
            $('#receiver').text(userData.login);
            $('#new-message').text(
                "Salut, j'aimerais aller avec toi au concert de "
                +concertData.title
                +" le "+dateToStr(concertData.start_time)
                +" à "+concertData.city+", "+concertData.venue_name+"."
            ).data('name',concertData.title).focus();

            closeLoading();
        };

        askDiese('get/concert',{user_id:getUserId(),concert_id:get('concert')},onConcertLoad,onError)
    };

    var onError = function(e){
        $('#conversation').append('<div class="system">Une erreur est survenue</div>');
        closeLoading();
    };

    askDiese('get/user',{user_id:get('to')}, onUserLoad, onError);
}

function addNewConvListener(){
    $('#send').on('click', function(){
        openLoading('Création de la conversation...');

        var onLoad = function(e){
            console.log(e);
            location.href = toPage('messagerie', {conv_id:e});
        };

        var onError = function(e){
            console.log('Erreur '+e);
            alert('Erreur, veuillez réessayer');
        };

        var msg = $('#new-message');
        askDiese('create/conversation', {
            text        : msg.val(),
            name        : msg.data('name'),
            open        : false,
            user_ids    : get('to'),
            creator_id  : getUserId(),
            concert_id  : get('concert')
        }, onLoad, onError)

    });
}

function addConvListener(){
    $('#send').on('click', function(){
        openLoading('Envoi du message...');

        var onLoad = function(e){
            closeLoading();
            console.log('envoyé');
        };

        var onError = function(e){
            console.log('Erreur '+e);
            alert('Erreur, veuillez réessayer');
        };

        askDiese('create/message', {
            text            : $('#new-message').val(),
            sender_id       : getUserId(),
            conversation_id : get('conv_id')
        }, onLoad, onError)
    });
}

function addResponsive(){
    var vh = $(window).height()/100;
    $('#conversation').css('height', ($(window).height()-30*vh-49)+'px');
}
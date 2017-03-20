$(function(){
    addSearchListener();
    searchConcerts();
});

function addSearchListener(){
    $('#search-form').on('submit', function(){
        var key = $('#search-input').val();
        if(key.length){
            $('ons-carousel-item').remove();
            searchConcerts({
                keywords : key
            });
        }
        return false;
    });
}

function searchConcerts(args){
    if(!args) args  = {};

    var onLoad = function(e){
        console.log(e);
        var data = $.parseJSON(e);
        console.log(data, (data.length != 0));
        if(data && (data.length != 0)){
            for(var i in data.events.event)
                createCard(data.events.event[i])
        } else {
            alert('aucun résultat');
        }
    };

    var onError = function(e){
        alert('Erreur '+ e.status);
    };

    askDiese(
        'get/concerts',
        args,
        onLoad,
        onError);
}

function createCard(event){
    var img = event.image != null ? event.image.large.url : '';
    var card = '<ons-carousel-item id="'+event.id+'">'
        + '<div class="card-content" style="background-image:url('+img+')">'
        + '<div class="event-name">'+event.title+'</div>'
        + '<div class="event-info">'+event.start_time+', '+event.venue_name+', '+event.city_name+'</div>'
        + '</div>'
        + '</ons-carousel-item>';

    $('ons-carousel').append(card);
}

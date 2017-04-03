$(function(){
    addSearchListener();
    searchConcerts();

    addResponsive();
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
        var data = $.parseJSON(e);
        console.log(data);

        var concertsNumber = (data && (data.length != 0) ? data.total_items : 'Aucun')
            +' concert'+(data.total_items > 1 ? 's' : '')
            +' trouvé' +(data.total_items > 1 ? 's' : '');

        $('#concerts-number').text(concertsNumber);
        $('#concerts-list').html('');

        if(data && (data.length != 0)){
            for(var i in data.events.event)
                addItem(data.events.event[i])
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

function addItem(event){
    var mulan = "http://static1.purebreak.com/articles/5/11/12/55/@/481104-mulan-aura-le-droit-a-son-film-en-live-a-200x200-1.jpg";
    var img = event.image != null ? event.image.large.url : mulan;
    var item = '<div class="concert" id="'+event.id+'" style="background-image:url('+img+')">'
        + '<div class="info">'
            + '<div class="artist">'+event.title+'</div>'
            + '<div class="event">Le '+dateToStr(event.start_time)+' à '+event.city_name
                +'<br><span class="venue">('+event.venue_name+')</span></div>'
        + '</div>'
        + '</div>';

    $('#concerts-list').prepend(item);
}

function addResponsive(){
    var vh = $(window).outerHeight()/100;
    $('#concerts-list').css('height', ($(window).outerHeight()-10*vh-60)+'px');
}
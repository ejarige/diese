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

function addScrollListener(){
    $("#concerts-list").bind('scroll', function ()
    {
        var divHeight   = $(this).innerHeight();
        var height      = $(this)[0].scrollHeight;
        var pos         = $(this).scrollTop();
        var limitPos    = height-divHeight-100;

        if(pos > limitPos){
            $("#concerts-list").unbind('scroll');
            searchConcerts({
                keywords : $('#search-input').val(),
                page : parseInt($('#concerts-number').data('page'))+1
            }, true);
        }
    });
}

function searchConcerts(args, append){
    if(!args) args  = {};
    if(!append) $('#concerts-list').html('');

    $('#concerts-loading').show();

    var onLoad = function(e){
        console.log(e);
        var data = $.parseJSON(e);
        console.log(data);

        var notEmpty = data && (data.length != 0);

        var concertsNumber =  (notEmpty ? data.total_items : 'Aucun')
            +' concert'+(data.total_items > 1 ? 's' : '')
            +' trouvé' +(data.total_items > 1 ? 's' : '');

        var page = notEmpty ? data.page_number : 0;

        $('#concerts-number')
            .text(concertsNumber)
            .data('page', page);

        if(notEmpty){
            for(var i in data.events.event)
                addItem(data.events.event[i])
        } else {
            alert('aucun résultat');
        }

        $('#concerts-loading').hide();
        addScrollListener();
    };

    var onError = function(e){
        alert('Erreur '+ e.status);
    };

    askDiese(
        'get/concerts',
        args,
        onLoad,
        onError
    );
}

function addItem(event){
    var mulan = "http://static1.purebreak.com/articles/5/11/12/55/@/481104-mulan-aura-le-droit-a-son-film-en-live-a-200x200-1.jpg";
    var img = event.image != null ? event.image.large.url : mulan;
    var item = '<div class="concert" id="'+event.id+'" style="background-image:url('+img+')">'
        + '<div class="info">'
            + '<div class="artist">'+event.title+'</div>'
            + '<div class="event">'+dateToStr(event.start_time)+', '+event.city_name+'</div>'
        + '</div>'
        + '</div>';

    $('#concerts-list').append(item).children(':last').hide().fadeIn(2000);
}

function addResponsive(){
    var vh = $(window).outerHeight()/100;
    $('#concerts-list').css('height', ($(window).outerHeight()-10*vh-60)+'px');
}
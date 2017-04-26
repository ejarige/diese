$(function(){
    console.log("Connecté avec user " + sessionStorage.userId);

    addSearchListener();
    searchConcerts();

    addResponsive();
});

function addSearchListener(){
    var timerid;
    $('#search-input').on("input",function(){
        var key = $(this).val();
        if($(this).data("lastval")!== key){
            $(this).data("lastval", key);

            clearTimeout(timerid);
            timerid = setTimeout(function() {
                if(key.length > 0){
                    $('ons-carousel-item').remove();
                    searchConcerts({
                        keywords : key
                    });
                } else {
                    searchConcerts();
                }
            }, 500);
        }
    });
}

function addScrollListener(){
    $("#concerts-list").bind('scroll', function ()
    {
        var divHeight   = $(this).innerHeight();
        var height      = $(this)[0].scrollHeight;
        var pos         = $(this).scrollTop();
        var limitPos    = height-divHeight-100;

        var pageData    = $('#concerts-number');
        var page        = parseInt(pageData.data('page'));
        var pageCount   = parseInt(pageData.data('pageCount'));

        if(pos > limitPos){
            if(page < pageCount){
                $("#concerts-list").unbind('scroll');
                searchConcerts({
                    keywords : $('#search-input').val(),
                    page : page+1
                }, true);
            }
        }
    });
}

function searchConcerts(args, append){
    if(!args) args  = {};
    if(!append) $('#concerts-list').html('');

    $('#concerts-loading').show();

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);

        var notEmpty = data && (data.length != 0);

        var concertsNumber =  (notEmpty ? data.total_items : 'Aucun')
            +' concert'+(data.total_items > 1 ? 's' : '')
            +' trouvé' +(data.total_items > 1 ? 's' : '');

        var page       = notEmpty ? data.page_number : 0;
        var pageCount  = notEmpty ? data.page_count  : 0;

        $('#concerts-number')
            .text(concertsNumber)
            .data('page', page)
            .data('pageCount', pageCount);

        if(notEmpty){
            for(var i in data.events.event)
                addItem(data.events.event[i])
        }

        $('#concerts-loading').hide();
        addScrollListener();
    };

    var onError = function(e){
        console.log(e);
        console.log('Erreur '+ e.status);
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

    $('#concerts-list').append(item).children(':last').hide().fadeIn(1000);
    $(document.getElementById(event.id)).on('click', function(){
        window.location.href = toPage('concert', {id:event.id});
    });
}

function addResponsive(){
    var vh = $(window).height()/100;
    $('#concerts-list').css('height', ($(window).height()-25*vh-49)+'px');
}
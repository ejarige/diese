var CATEGORIES; // categories cache

$(function(){
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
                    searchConcerts();
                } else {
                    searchConcerts();
                }
            }, 500);
        }
    });

    $('#filters').on('click', function(){
        openFiltersModal();
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
                searchConcerts(true);
            }
        }
    });
}

function searchConcerts(append){
    if(!append) $('#concerts-list').html('');

    $('#concerts-loading').show();

    var args = {};

    var keywords   = $('#search-input').val();
    var location   = $('#coordinates').val();
    var range      = $('#range').val();
    var category   = $('.selected').map(function(){return $(this).data('value')});
    var dateFrom   = $('#date-from').val();
    var dateTo     = $('#date-to').val();

    if(keywords && keywords.length) args.keywords = keywords;
    if(location && location.length) args.location = location;
    if(range && range.length)       args.within   = range*2;
    if(category && category.length) args.category = category.join();
    //if(dateFrom && dateFrom.length) params.date     = 'date'; //TODO
    //if(dateTo && dateTo.length)   params.date     += 'date';
    if(append) args.page = parseInt($('#concerts-number').data('page'))+1;

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);

        var notEmpty = data && (data.length != 0);

        var concertsNumber =  (notEmpty ? data.total_items : 'Aucun')
            +' concert'+(data.total_items > 1 ? 's' : '')
            +' trouvé' +(data.total_items > 1 ? 's' : '');

        var page       = notEmpty ? data.page_number : 0;
        var pageCount  = notEmpty ? data.page_count  : 0;

        $('.concerts-number')
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

function openFiltersModal(){
    openLoading('Récupération des catégories...');

    var openFilters = function(){
        addFiltersListener();
        $('#edit-filters').animate({
            width: '100%',
            height: '100%',
            opacity: 1
        }, 'normal');
    };

    var closeFilters = function(){
        $('#edit-filters').animate({
            height: '0',
            opacity: 0
        }, 'normal', function(){
            $(this).addClass('hide');
        });
    };

    var addFiltersListener = function(){

        $('#location').on('change', function(){
            askGoogleMapsCoordinates($(this).val(), function(coords){
                if(coords){
                    $('#coordinates').val(coords.latitude+','+coords.longitude);
                    searchConcerts();
                } else {
                    alert('lieu inconnu');
                }
            });
        });

        $('#range').on('input', function(){
            $('#range-value > span').text($(this).val()*2)
        });

        $('.filter-item').on('change', function(){
            searchConcerts();
        });

        $('.category').on('click', function(){
            $(this).toggleClass('selected');
        });

        $('#close-filters').on('click', function(){
            closeFilters();
        });
    };

    var onLoad = function(e){
        CATEGORIES = $.parseJSON(e);

        var categories = '';
        for(var i in CATEGORIES)
            categories += '<div class="category" data-value="'+CATEGORIES[i].eventful_id+'">'
                    +CATEGORIES[i].alias+'</div>';

        var modal = '<div id="edit-filters">'
            +'<div id="close-filters">X</div>'
            +'<div id="reset-filters">Réanitialiser les filtres</div>'
            +'<strong>Ta distance géographique</strong><br>'
            +'<input type="text" id="location" placeholder="Pays, Ville..."><br>'
            +'<input type="text" id="coordinates" class="hide filter-item"><br>'
            +'<input type="range" id="range" class="range filter-item">'
            +'<div id="range-value"><span>50</span>km</div><br>'
            +'<strong>Tes genres musicaux</strong><br>'
            +'<div class="categories">'+categories+'</div>'
            +'<strong>Tes dates</strong><br>'
            +'<label for="date-from">A partir de</label><br>'
            +'<input type="date" class="filter-item" id="date-from">'
            +'<label for="date-to">Jusqu\'au</label>'
            +'<input type="date" class="filter-item" id="date-to">'
            +'<div id="concerts-number-filters" class="concerts-number">'+$('#concerts-number').val()+'</div>'
            +'</div>';

        $('body').append(modal);
        closeLoading();
        openFilters();
    };

    var onError = function(e){
        console.log("Error " + e);
    };

    askDiese('get/categories', {}, onLoad, onError);
}

function addResponsive(){
    var vh = $(window).height()/100;
    $('#concerts-list').css('height', ($(window).height()-25*vh-49)+'px');
}
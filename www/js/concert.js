$(function(){
   getConcert();
    addConcertListener();
});

function getConcert(){

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);

        var image = !!data.images ? (
            Array.isArray(data.images.image) ? data.images.image[0].large.url : data.images.image.large.url
        ) : '';

        $('#concert-name').text(data.title);
        $('#concert-venue').text(dateToStr(data.start_time)+', '+data.city);
        $('#banner').css({
           'background' : 'url('+image+')'
        });
    };

    var onError = function(e){
        console.log(e);
    };


    askDiese(
        'get/concert',
        {
            concert_id: get('id')
        },
        onLoad,
        onError
    );
}

function addConcertListener(){
    $('#favorite').on('click', function(){
        askDiese(
            'create/favorite',
            {
                user_id: getUserId(),
                concert_id: get('id')
            },
            function(){
                console.log("Favori ajouté !");
            },
            function(e){
                console.log("Error " + e);
            }
        )
    });

    $('#find-buddy').on('click', function(){
        var loading = '<p id="patience">Patience !</p>'
                    +'<p id="recherche_en_cours"> On recherche ton pote de concert idéal !</p>';

        openLoading(loading);

        askDiese(
            'get/buddy',
            {
                user_id: getUserId(),
                concert_id:get('id')
            },
            function( e){
                var data = $.parseJSON(e);
                console.log(data);

                closeLoading();

                if(data.length){
                    showBuddyModal(data, 0);
                } else {
                    showNobodyModal();
                }
            },
            function(e){
                console.log("Error " + e);
            }
        )
    });
}

function showBuddyModal(data, i){
    var blocker = '<div id="blocker"></div>';
    var modal = '<div id="pop_up">'
        +'<p id="yeah">Yeah !</p>'
        +'<div id="photo_et_prenom_age_ville">'
        +'<div id="photo" style="background-image: url('+data[i].avatar+')"></div>'
        +'<div id="prenom_age_ville"><p>'+data[i].login+'<br>'+data[i].age+' ans<br>'+data[i].lieu+'</p></div>'
        +'</div>'
        +'<div id="presentation">'
        +'<p>Voici '+data[i].login+' ! Il aime *data.musictag*, *data.musictag2* et son dernier concert était *data.last_concert*.</p>'
        +'</div>'
        +'<div id="lets_talk"><p>Discutons</p></div>'
        +'<div id="sry_no"><p>Non, pas tout de suite</p></div>'
        +'<div id="tarplu"><p>Annuler la recherche</p></div>'
        +'</div>';

    $('body').append(blocker+modal);

    $('#lets_talk').on('click', function(){
        console.log("discutons");
        $('#pop_up, #blocker').remove();
    });

    $('#sry_no').on('click', function(){
        console.log("non merci");
        $('#pop_up, #blocker').remove();

        if(i+1 < data.length){
            showBuddyModal(data, i+1);
        } else {
            showNobodyModal();
        }
    });

    $('#tarplu').on('click', function(){
        console.log("annulation");
        $('#pop_up, #blocker').remove();
    });
}

function showNobodyModal(){
    var blocker = '<div id="blocker"></div>';
    var modal = '<div id="pop_up">'
        +'<p id="desole">Désolé !</p>'
        +'<p id="explications"> Il semblerait que personne ne te corresponde pour le moment, mais pas de panique !</p>'
        +"<p> On te contacte dés qu'on trouve ton pote de concert idéal.</p>"
        +'<div id="back_to_concert"><p>Revenir à la page concert</p></div>'
        +'<div id="tarplu"><p>Non merci, ne pas m\'inscrire</p></div>'
        +'</div>';

    $('body').append(blocker+modal);

    $('#back_to_concert').on('click', function(){
        console.log("ajout liste");
        // TODO AJOUT WAITING LIST
        $('#pop_up, #blocker').remove();
    });

    $('#tarplu').on('click', function(){
        console.log("annulation");
        $('#pop_up, #blocker').remove();
    });
}
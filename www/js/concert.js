$(function(){
    getConcert();
    addConcertListener();
});

function getConcert(){

    openLoading('Chargement...');

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);

        var image = !!data.images ? (
            Array.isArray(data.images.image) ? data.images.image[0].large.url : data.images.image.large.url
        ) : '';

        $('#concert-name').text(data.title);
        /*Kévin a écrit ce truc juste en dessous*/
        if(data.favorite){
            $('#favorite')
                .css({backgroundImage:'url(./img/icons/BLANC/PNG/white_star.png'})
                .on('click', function(){
                   askDiese(
                       'remove/favorite',
                       {
                           user_id: getUserId(),
                           concert_id: get('id')
                       },
                       function(e){
                           $('#annonce_add_to_fav').text('Ce concert a été retiré de tes favoris');
                           $('#favorite').css({backgroundImage:'url(./img/icons/BLANC/PNG/star.png'})
                       },
                       function(e){
                           console.log('Erreur ' + e);
                       }
                   )
                });
        } else {

            $('#favorite').on('click', function(){
                askDiese(
                    'create/favorite',
                    {
                        user_id: getUserId(),
                        concert_id: get('id')
                    },
                    function(){
                        console.log("Favori ajouté !");
                        /*Kévin a écrit ça aussi*/
                        $('#annonce_add_to_fav').text('Ce concert a été ajouté à tes favoris');
                        $('#favorite').css({backgroundImage:'url(./img/icons/BLANC/PNG/white_star.png'});
                    },
                    function(e){
                        console.log("Error " + e);
                    }
                )
            });
        }

        $('#concert-venue').text(dateToStr(data.start_time)+', '+data.city);
        $('#banner').css({
           'backgroundImage' : 'url('+image+')'
        });
        if(data.user_waiting){
            $('#stop-waiting').removeClass('hide');
        } else {
            $('#find-buddy').removeClass('hide');
        }

        for(var i in data.friends_waiting){
            $('#friends-list').append(
                '<div data-id="'+data.friends_waiting[i].id+'" class="item" '
                + ' style="background-image: url('+data.friends_waiting[i].avatar+')">'
            )
        }

        for(var i in data.all_waiting){
            $('#waiting-list').append(
                '<div data-id="'+data.all_waiting[i].id+'" class="item" '
                + ' style="background-image: url('+data.all_waiting[i].avatar+')">'
            )
        }

        $('.item').on('click', function(){
            window.location.href = toPage('profil', {id: $(this).data('id')});
        });


        closeLoading();

    };

    var onError = function(e){
        console.log(e);
    };


    askDiese(
        'get/concert',
        {
            user_id: getUserId(),
            concert_id: get('id')
        },
        onLoad,
        onError
    );
}

function addConcertListener(){
    $('#find-buddy').on('click', function(){
        var loading = '<p id="patience">Patience !</p>'
                    +'<p id="recherche_en_cours"> On recherche ton pote de concert idéal !</p>';

        openLoading(loading);

        askDiese(
            'get/waiting',
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

    $('#stop-waiting').on('click', function(){
        var blocker = '<div id="blocker"></div>';
        var modal = '<div id="pop_up">'
            +'<p id="yeah">Confirmation</p>'
            +'Es-tu sûr de vouloir te désinscrire de cette liste ?'
            +'<input id="oui" type="button" value="Oui">'
            +'<input id="non" type="button" value="Non">';

        $('body').append(blocker+modal);

        $('#oui').on('click', function(){
            console.log("yes pls");
            $('#pop_up, #blocker').remove();
            openLoading('Désinscription en cours');
            askDiese(
                'remove/waiting',
                {
                    user_id: getUserId(),
                    concert_id: get('id')
                },
                function(){
                    console.log("Désinscription réussie");
                    $('#stop-waiting').addClass('hide');
                    $('#find-buddy').removeClass('hide');
                    closeLoading();
                },
                function(e){
                    console.log("Erreur " + e);
                }
            );
        });

        $('#non').on('click', function(){
            console.log("not rly");
            $('#pop_up, #blocker').remove();
        });

    });
}

function showBuddyModal(data, i){

    var showNextModal = function(){
        $('#pop_up, #blocker').remove();

        if(i+1 < data.length){
            showBuddyModal(data, i+1);
        } else {
            showNobodyModal();
        }
    };

    if(!data[i].login) return showNextModal();

    var blocker = '<div id="blocker"></div>';
    var modal = '<div id="pop_up">'
        +'<p id="yeah">Yeah !</p>'
        +'<div id="photo_et_prenom_age_ville">'
        +'<div id="photo" style="background-image: url('+data[i].avatar+')"></div>'
        +'<div id="prenom_age_ville"><p>'+data[i].login+', '+data[i].age+' ans, '+data[i].lieu+'</p></div>'
        +'</div>'
        +'<div id="presentation">'
        +'<p>Voici '+data[i].login
        +'!<br><em>Ses goûts musicaux :</em>';

    if(data[i].tags.length){
        var categories = '';

        for(var j in data[i].tags)
            categories += '<div class="category">'+data[i].tags[j].alias+'</div>';

        modal += '<div id="categories">'+categories+'</div>';
    }

    modal += '</p>'
        +'</div>'
        +'<div id="lets_talk"><p>Discutons</p></div>'
        +'<div id="sry_no"><p>Non, pas tout de suite</p></div>'
        +'<div id="tarplu"><p>Annuler la recherche</p></div>'
        +'</div>';

    $('body').append(blocker+modal);

    $('#lets_talk').on('click', function(){
        location.href = toPage('messagerie', {
            type    : 'new_conv',
            concert : get('id'),
            to      : data[i].id
        });
    });

    $('#sry_no').on('click', function(){
        console.log("non merci");
        showNextModal();
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
        $('#pop_up, #blocker').remove();
        openLoading('Inscription en cours');

        askDiese(
            'create/waiting',
            {
                user_id: getUserId(),
                concert_id: get('id')
            },
            function(){
                console.log("Inscription reussie");
                closeLoading();
                $('#find-buddy').addClass('hide');
                $('#stop-waiting').removeClass('hide');
            },
            function(e){
                console.log("Erreur " + e);
            }
        );
    });

    $('#tarplu').on('click', function(){
        console.log("annulation");
        $('#pop_up, #blocker').remove();
    });
}
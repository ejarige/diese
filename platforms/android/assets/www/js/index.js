$(function() {
    addMenuListener();
    /*addDocListener();*/
    // MERCI ET TARPLU
    $('#back-home').on('click', function(){
        $('#ty-and-bye').addClass('hidden');
        $('ons-carousel-item').removeClass('hidden');
    });
    /* Kévin here*/
    $('#go-to-sign').on('click', function(){
        $('#ty-and-bye').addClass('hidden');
        $('ons-carousel-item').removeClass('hidden');
        carousel.last();
    });

    // CONNEXION
    $('#formulaire-connexion').on('submit', function(){

        // nettoyage formulaire
        var form = $('#signin-submit');
        form.prop('disabled', true);
        $('.infobox').text('');

        // verification des champs obligatoires
        var empty = false;
        $(this).find('.required').each(function(){
            var thisEmpty = !$(this).val().length;
            if(thisEmpty)
                $('#info-'+$(this).attr('id')).text('Ce champ est obligatoire !');

            empty = empty || thisEmpty;
        });

        if(empty) {
            form.prop('disabled', false);
            return false;
        }

        openLoading("Connexion...");

        var onLoad = function(e){
            closeLoading();
            if(!e){
                console.log("introuvable : ", e);
                $('#info-signin-login').text('Login et/ou mot de passe incorrect.')
            } else {
                console.log("connexion : ", e);
                sessionStorage.userId = e;
                window.location.href = "concerts.html";
            }
            form.prop('disabled', false);
        };

        var onError = function(e){
            closeLoading();
            console.log("erreur", e);
        };

        askDiese(
            'get/session',
            {
                login    : $('#signin-login').val().toLowerCase(),
                password : sha1($('#signin-pass').val().toLowerCase())
            },
            onLoad,
            onError
        );
        return false;
    });

    // INSCRIPTION
    $('#formulaire-inscription').on('submit', function(){
        // nettoyage formulaire
        var form = $('#form-submit');
        form.prop('disabled', true);
        $('.infobox').text('');

        // verification des champs obligatoires
        var empty = false;
        $(this).find('.required').each(function(){
            var thisEmpty = !$(this).val().length;
            if(thisEmpty)
                $('#info-'+$(this).attr('id')).text('Ce champ est obligatoire !');

           empty = empty || thisEmpty;
        });

        if(empty) {
            form.prop('disabled', false);
            return false;
        }

        // verification login
        var login      = $('#pseudo').val().toLowerCase();
        var loginError = $('#info-pseudo');
        var loginRegex = /^[a-zA-Z0-9_]{3,16}$/;

        if(!loginRegex.test(login)){
            loginError.text('Doit être composé de 3 à 16 caractères alpha-numériques');
            form.prop('disabled', false);
            return false;
        }

        // verification email
        var email      = $('#email').val().toLowerCase();
        var emailError = $('#info-email');
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!emailRegex.test(email)){
            emailError.text('Mail incorrect');
            form.prop('disabled', false);
            return false;
        }

        openLoading("Création du compte...");

        // callback création réussie
        var onLoad = function(e){
            closeLoading();
            form.prop('disabled', false);
            $('ons-carousel-item').addClass('hidden');
            $('#ty-and-bye').removeClass('hidden');
        };

        // callback erreur
        var onError = function(e){
            console.log(e);
            if(void 0 === e){
                var data = $.parseJSON(e.responseText);
                closeLoading();

                for(var i in data){
                    if(data[i].email == $('#email').val())
                        emailError.text('Un compte avec ce mail existe déjà.');

                    if(data[i].login == $('#pseudo').val())
                        loginError.text('Ce pseudo existe déjà.');
                }
                form.prop('disabled', false);
            } else {
                closeLoading();
                alert('une erreur est survenue');
                console.log(e);
                form.prop('disabled', false);
            }
        };

        // appel service inscription
        askDiese(
            'create/account',
            {
                login    : login,
                email    : email,
                password : sha1($('#pass').val()),
                prenom   : $('#firstname').val()
            },
            onLoad,
            onError
        );
        return false;
    });

    // Enlève messages d'erreur a la modification
    $('.required').on('change', function(){
       $('#info-'+$(this).attr('id')).text('');
    });

    //Kévin a fait ça aussi
    $('#sign-in').on('click', function(){
        carousel.last();
    });
});
/*
function addDocListener(){
    var openConditionUtilisation = function(){
        var modal = '<div id="read_CG">'
            +'<h1>Condition d\'utilisation</h1>'
            +'blablablablablablablabla'
            +'blablablablablabla'
            +'blablablabla';
            /*+'<form id="edit-form">'
            +'<label id="edit-avatar-label" for="edit-avatar"></label>'
            +'<input id="edit-avatar" type="file">'
            +'<label for="edit-name">Prénom :</label>'
            +'<input type="text" id="edit-name" maxlength="16"><br>'
            +'<label for="edit-age">Age :</label>'
            +'<input type="number" id="edit-age" min="18" step="1" max="99"><br>'
            +'<label for="edit-location">Ville :</label>'
            +'<input type="text" id="edit-location" maxlength="32">'
            +'<div id="edit-actions">'
            +'<input type="submit" value="Valider">'
            +'<input type="button" id="cancel" value="Annuler">'
            +'</div>'
            +'</form>'
            +'</div>';*/

        /*$('body').append(modal);
    };
    var openMentionLegales = function(){
        var modal = '<div id="read_ML">'
            +'<h1>Condition d\'utilisation</h1>'
            +'blablablablablablablabla'
            +'blablablablablabla'
            +'blablablabla';*/
        /*+'<form id="edit-form">'
         +'<label id="edit-avatar-label" for="edit-avatar"></label>'
         +'<input id="edit-avatar" type="file">'
         +'<label for="edit-name">Prénom :</label>'
         +'<input type="text" id="edit-name" maxlength="16"><br>'
         +'<label for="edit-age">Age :</label>'
         +'<input type="number" id="edit-age" min="18" step="1" max="99"><br>'
         +'<label for="edit-location">Ville :</label>'
         +'<input type="text" id="edit-location" maxlength="32">'
         +'<div id="edit-actions">'
         +'<input type="submit" value="Valider">'
         +'<input type="button" id="cancel" value="Annuler">'
         +'</div>'
         +'</form>'
         +'</div>';*/

       /* $('body').append(modal);
    };
    var openChartePote = function(){
        var modal = '<div id="read_CP">'
            +'<h1>Condition d\'utilisation</h1>'
            +'blablablablablablablabla'
            +'blablablablablabla'
            +'blablablabla';*/
        /*+'<form id="edit-form">'
         +'<label id="edit-avatar-label" for="edit-avatar"></label>'
         +'<input id="edit-avatar" type="file">'
         +'<label for="edit-name">Prénom :</label>'
         +'<input type="text" id="edit-name" maxlength="16"><br>'
         +'<label for="edit-age">Age :</label>'
         +'<input type="number" id="edit-age" min="18" step="1" max="99"><br>'
         +'<label for="edit-location">Ville :</label>'
         +'<input type="text" id="edit-location" maxlength="32">'
         +'<div id="edit-actions">'
         +'<input type="submit" value="Valider">'
         +'<input type="button" id="cancel" value="Annuler">'
         +'</div>'
         +'</form>'
         +'</div>';*/

        /*$('body').append(modal);
    };

    var openCharteConfi = function(){
        var modal = '<div id="read_CF">'
            +'<h1>Condition d\'utilisation</h1>'
            +'blablablablablablablabla'
            +'blablablablablabla'
            +'blablablabla';*/
        /*+'<form id="edit-form">'
         +'<label id="edit-avatar-label" for="edit-avatar"></label>'
         +'<input id="edit-avatar" type="file">'
         +'<label for="edit-name">Prénom :</label>'
         +'<input type="text" id="edit-name" maxlength="16"><br>'
         +'<label for="edit-age">Age :</label>'
         +'<input type="number" id="edit-age" min="18" step="1" max="99"><br>'
         +'<label for="edit-location">Ville :</label>'
         +'<input type="text" id="edit-location" maxlength="32">'
         +'<div id="edit-actions">'
         +'<input type="submit" value="Valider">'
         +'<input type="button" id="cancel" value="Annuler">'
         +'</div>'
         +'</form>'
         +'</div>';*/

        /*$('body').append(modal);
    };
    var closeSettings = function(){
        $('#read_CG').animate({
            width: '0',
            height: '0',
            opacity: 0
        }, 'normal', function(){
            $(this).remove();
        });
    };

    $('#conditions_utilisation').on('click', function(){
        openConditionUtilisation();
    });
    $('#mentions_legales').on('click', function(){
        openMentionLegales();
    });
    $('#openChartePote').on('click', function(){
        openMentionLegales();
    });
    $('#charte_de_confidentialite').on('click', function(){
        openCharteConfi();
    });
<<<<<<< HEAD

}*/
/**
 * Created by kgaillar on 29/03/2017.
 */
var PROFIL_DATA = {id:''};

$(function(){
    recupDataUser();
    addEditListener();
    addResponsive();
});

function recupDataUser(){
    openLoading('Chargement...');

    PROFIL_DATA.id = get('id') ? get('id') : getUserId();

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);
        closeLoading();

        if(data && (data.length != 0)){
            PROFIL_DATA.data = data;

            afficherInfo(data);
        } else {
            console.log('aucun résultat');
        }
    };

    var onError = function(e){
        console.log('Erreur '+ e.status);
    };

    askDiese(
        "get/user",
        {
            user_id: PROFIL_DATA.id
        },
        onLoad,
        onError
    );
}

function afficherInfo(data){
    var infoLogin = data.login+' ('+data.prenom+')<br>' +data.age+' ans, '+data.lieu;

    $('#prenom_age_ville').html(infoLogin);
    $('#photo').css({backgroundImage:'url('+data.avatar+')'});

    if(PROFIL_DATA.id != getUserId()){
        $('#roue').remove();
    }
}

function preFillForm(data){
    $('#edit-name').val(data.prenom);
    $('#edit-age').val(data.age);
    $('#edit-location').val(data.lieu);
    $('#edit-avatar-label').css({backgroundImage:'url('+data.avatar+')'})
}

function addEditListener(){
    var openSettings = function(){
        var modal = '<div id="edit-profile">'
            +'<h1>Modifier mon profil</h1>'
            +'<form id="edit-form">'
                +'<label id="edit-avatar-label" for="edit-avatar"></label>'
                +'<input id="edit-avatar" type="file">'
                +'<label for="edit-name" id="info-prenom">Prénom :</label>'
                +'<input type="text" id="edit-name" maxlength="16"><br>'
                +'<label for="edit-age" id="info-age">Age :</label>'
                +'<input type="number" id="edit-age" min="18" step="1" max="99"><br>'
                +'<label for="edit-location" id="info-ville">Ville :</label>'
                +'<input type="text" id="edit-location" maxlength="32"><br>'
                +'<label for="edit-tags1" id="info-tags1">Tags 1 :</label>'
                +'<select name="tags1" id="tags1">'
                +'<option value="vide"></option>'
                +'<option value="Alternatif">Alternatif</option>'
                +'<option value="Blues">Blues</option>'
                +'<option value="Classique">Classique</option>'
                +'<option value="Country">Country</option>'
                +'<option value="Dance">Dance</option>'
                +'<option value="Electro">Electro</option>'
                +'<option value="Enfants">Enfants</option>'
                +'<option value="Folk">Folk</option>'
                +'<option value="Hip Hop/Rap">Hip Hop/Rap</option>'
                +'<option value="Jazz">Jazz</option>'
                +'<option value="Latino">Latino</option>'
                +'<option value="Metal">Metal</option>'
                +'<option value="Opera">Opéra</option>'
                +'<option value="Pop">Pop</option>'
                +'<option value="R&B/Soul">R&B/Soul</option>'
                +'<option value="Reggae">Reggae</option>'
                +'<option value="Religieux">Religieux</option>'
                +'<option value="Rock">Rock</option>'
                +'<option value="Variete">Variete</option>'
                +'<option value="Vocale">Vocale</option>'
                +'<option value="World">World</option>'
                +'</select><br>'
                +'<label for="edit-tags2" id="info-tags2">Tags 2 :</label>'
                +'<select name="tags2" id="tags2">'
                +'<option value="vide"></option>'
                +'<option value="Alternatif">Alternatif</option>'
                +'<option value="Blues">Blues</option>'
                +'<option value="Classique">Classique</option>'
                +'<option value="Country">Country</option>'
                +'<option value="Dance">Dance</option>'
                +'<option value="Electro">Electro</option>'
                +'<option value="Enfants">Enfants</option>'
                +'<option value="Folk">Folk</option>'
                +'<option value="Hip Hop/Rap">Hip Hop/Rap</option>'
                +'<option value="Jazz">Jazz</option>'
                +'<option value="Latino">Latino</option>'
                +'<option value="Metal">Metal</option>'
                +'<option value="Opera">Opéra</option>'
                +'<option value="Pop">Pop</option>'
                +'<option value="R&B/Soul">R&B/Soul</option>'
                +'<option value="Reggae">Reggae</option>'
                +'<option value="Religieux">Religieux</option>'
                +'<option value="Rock">Rock</option>'
                +'<option value="Variete">Variete</option>'
                +'<option value="Vocale">Vocale</option>'
                +'<option value="World">World</option>'
                +'</select><br>'
                +'<label for="edit-tags3" id="info-tags3">Tags 3 :</label>'
                +'<select name="tags3" id="tags3">'
                +'<option value="vide"></option>'
                +'<option value="Alternatif">Alternatif</option>'
                +'<option value="Blues">Blues</option>'
                +'<option value="Classique">Classique</option>'
                +'<option value="Country">Country</option>'
                +'<option value="Dance">Dance</option>'
                +'<option value="Electro">Electro</option>'
                +'<option value="Enfants">Enfants</option>'
                +'<option value="Folk">Folk</option>'
                +'<option value="Hip Hop/Rap">Hip Hop/Rap</option>'
                +'<option value="Jazz">Jazz</option>'
                +'<option value="Latino">Latino</option>'
                +'<option value="Metal">Metal</option>'
                +'<option value="Opera">Opéra</option>'
                +'<option value="Pop">Pop</option>'
                +'<option value="R&B/Soul">R&B/Soul</option>'
                +'<option value="Reggae">Reggae</option>'
                +'<option value="Religieux">Religieux</option>'
                +'<option value="Rock">Rock</option>'
                +'<option value="Variete">Variete</option>'
                +'<option value="Vocale">Vocale</option>'
                +'<option value="World">World</option>'
                +'</select><br>'
                +'<div id="edit-actions">'
                    +'<input type="submit" id ="valid" value="Valider">'
                    +'<input type="button" id="cancel" value="Annuler">'
                +'</div>'
            +'</form>'
            +'</div>';

        $('body').append(modal);

        preFillForm(PROFIL_DATA.data);

        $('#cancel').on('click', function(){
            closeSettings();
        });

        $('#edit-avatar').on('change', function(){
            if (this.files && this.files[0]) {
                var file = this.files[0];
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log(e.target);
                    if (file.size>3000){
                        alert("Votre avatar est trop grand");
                    } else {
                        $('#edit-avatar-label').css({backgroundImage:'url('+ e.target.result+')'});
                    }
                };

                reader.readAsDataURL(this.files[0]);
            }
        });

        $('#edit-form').on('submit', function(){
            openLoading('Modification en cours');

            var form = new FormData();

            form.append('age',      $('#edit-age').val());
            form.append('prenom',   $('#edit-name').val());
            form.append('ville',    $('#edit-location').val());
            form.append('avatar',   $('#edit-avatar').prop('files')[0]);
            form.append('userId',   getUserId());

            $.ajax({
                url: DIESE_SERVICE+'edit/profile.php',
                cache: false,
                dataType: 'text',
                contentType: false,
                processData: false,
                data: form,
                type: 'post',
                success: function(e){
                    console.log(e);
                    recupDataUser();
                    closeSettings();
                    closeLoading();
                },
                error: function(e){
                    console.log(e);
                    closeLoading();
                }
            });

            return false;
        });

        $('#edit-profile').animate({
            width: '100%',
            height: '100%',
            opacity: 1
        }, 'normal');
    };

    var closeSettings = function(){
        $('#edit-profile').animate({
            width: '0',
            height: '0',
            opacity: 0
        }, 'normal', function(){
            $(this).remove();
        });
    };

    $('#roue').on('click', function(){
        openSettings();
    });
}

function addResponsive(){
    var vh = $(window).height()/100;
    $('.rectangle_blanc').css('height', ($(window).height()-24*vh-150)+'px');
}
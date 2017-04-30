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
        console.log(data, (data.length != 0));
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
    $('#photo').css({backgroundImage:'url('+data.avatar+')'})

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
            +'</div>';

        $('body').append(modal);

        preFillForm(PROFIL_DATA.data);

        $('#cancel').on('click', function(){
            closeSettings();
        });

        $('#edit-avatar').on('change', function(){
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#edit-avatar-label').css({backgroundImage:'url('+ e.target.result+')'});
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
/**
 * Created by kgaillar on 29/03/2017.
 */
var PROFIL_DATA = {id:''};
var CATEGORIES;

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

    // tags
    if(data.user_tags.length){
        var categories = '';

        for(var j in data.user_tags)
            categories += '<div class="tag">'+data.user_tags[j].alias+'</div>';

        $('#ligne-favori').append(categories);
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
        var isFav = function(id){
            for(var tag in PROFIL_DATA.data.user_tags)
                if(id == PROFIL_DATA.data.user_tags[tag].category_id)
                    return true;
            return false
        };

        var categories = '';
        for(var i in CATEGORIES)
            categories += '<div class="category'
                +(isFav(CATEGORIES[i].eventful_id) ? ' selected' : '')+'" data-value="'+CATEGORIES[i].eventful_id+'">'
                +CATEGORIES[i].alias+'</div>';

        var modal = '<div id="edit-profile">'
            +'<h1>Modifier mon profil</h1>'
            +'<form id="edit-form">'
                +'<label id="edit-avatar-label" for="edit-avatar"></label>'
                +'<input id="edit-avatar" type="file">'
                +'<div id="edit-fields">'
                    +'<label for="edit-name" id="info-prenom">Prénom :</label><br>'
                    +'<input type="text" id="edit-name" maxlength="16"><br>'
                    +'<label for="edit-age" id="info-age">Age :</label><br>'
                    +'<input type="number" id="edit-age" min="18" step="1" max="99"><br>'
                    +'<label for="edit-location" id="info-ville">Ville :</label><br>'
                    +'<input type="text" id="edit-location" maxlength="32">'
                    +'<div id="genre_music" class="title">Tes genres musicaux</div><br>'
                    +'<div id="categories">'+categories+'</div>'
                +'</div>'
                +'<div id="edit-actions">'
                    +'<input type="submit" id ="valid" value="Valider">'
                    +'<input type="button" id="cancel" value="Annuler">'
                +'</div>'
            +'</form>'
            +'</div>';

        $('body').append(modal);

        $('.category').on('click', function(){
            $(this).toggleClass('selected');
        });

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
            form.append('categories',
                $('.selected').map( function() {
                    return $(this).data('value');
                }).get().join(",")
            );

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
            $('#back_link').show();
        });
    };

    $('#roue').on('click', function(){
        $('#back_link').hide();
        if(void 0 === CATEGORIES){
            openLoading('Récupération des tags...');
            askDiese(
                'get/categories', {},
                function(e){
                    closeLoading();
                    CATEGORIES = $.parseJSON(e);
                    openSettings();
                },
                function(e){
                    closeLoading();
                    console.log('Erreur '+e);
                }
            )
        } else {
            openSettings();
        }
    });
}

function addResponsive(){
    var vh = $(window).height()/100;
    $('.rectangle_blanc').css('height', ($(window).height()-24*vh-150)+'px');
}
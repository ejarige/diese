/**
 * Created by kgaillar on 29/03/2017.
 */
$(function(){
    recupDataUser();
    addEditListener();
});

function recupDataUser(){

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data, (data.length != 0));
        if(data && (data.length != 0)){
            afficherInfo(data);
        } else {
            alert('aucun résultat');
        }
    };

    var onError = function(e){
        alert('Erreur '+ e.status);
    };

    askDiese(
        "get/user",
        {
            user_id:getUserId()
        },
        onLoad,
        onError
    );
}

function afficherInfo(data){
    var infoLogin = '<p>'+data.login+'</p>';

    $('#prenom_age_ville').append(infoLogin);
}

function addEditListener(){
    $('.roue').on('click', function(){
        // TODO
    });
}

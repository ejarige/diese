$(function() {
    // CARDS NAV
    var CARDS_MAX = 2;
    
    $(document).hammer().on("swiperight", function() {
        var prevCard = parseInt($('.active').attr('id').split('-')[1])-1;
        if(prevCard > 0){
            var prevCardId = '#page-'+prevCard;
            $('.card').removeClass('active');
            $(prevCardId).addClass('active');
        }
    });
    
    $(document).hammer().on("swipeleft", function() {
        var nextCard = parseInt($('.active').attr('id').split('-')[1])+1;
        if(nextCard <= CARDS_MAX){
            var nextCardId = '#page-'+nextCard;
            $('.card').removeClass('active');
            $(nextCardId).addClass('active');
        }
    });
    
    // INSCRIPTION
    $('#formulaire-inscription').on('submit', function(){
        inscription({
            login    : $('#pseudo').val(),
            email    : $('#email').val(),
            password : $('#pass').val(),
            prenom   : $('#firstname').val()
        }, function(){
            alert('Compte créé');
        }, function(){
            alert('Erreur');
        });
        return false;
    });
});

function inscription(values, onSuccess, onError){
    $.ajax({
      type      : 'POST',
      url       : 'http://diese.pe.hu/services/create/account.php',
      data      : values,
      success   : onSuccess,
      error     : onError
    });
}
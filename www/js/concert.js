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
       askDiese(
           'get/buddy',
           {
               user_id: getUserId(),
               concert_id:get('id')
           },
           function(e){
               console.log(e);
               var data = $.parseJSON(e);
               console.log(data);
           },
           function(e){
               console.log("Error " + e);
           }
       )
    });
}
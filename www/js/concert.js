$(function(){
   getConcert();
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
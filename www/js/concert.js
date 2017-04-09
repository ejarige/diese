$(function(){
   getConcert();
});

function getConcert(){

    var onLoad = function(e){
        var data = $.parseJSON(e);
        console.log(data);
        $('#concert-name').text(data.title);
        $('#concert-venue').text(dateToStr(data.start_time)+', '+data.city);
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
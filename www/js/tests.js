$(function(){
    askDiese(
        'get/user',
        {
            user_id:28
        },
        function(e){
            $('#toast').text('done '+e);
        },
        function(e){
            $('#toast').text('error '+e);
        }
    )
});
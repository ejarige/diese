/**
 * Created by kgaillar on 29/03/2017.
 */
$(function(){
   RecupDataUser();
})
function RecupDataUser(){
    var onLoad=function(e){
        console.log(e);
    };
    var onError=function(e){
        console.log(e);
    };
    askDiese(
        "get/user",
    {
        user_id:28
    },
    onLoad,
        onError
    )
}
var keysPress=new Array(1000);
var handle=0;
var tilt=0;
window.addEventListener('devicemotion', function (event) {
    var gv = event.accelerationIncludingGravity;
    tilt=gv.x/10;
    if(navigator.userAgent.indexOf('iPad') > 0){
        tilt*=-1;
    }else if(navigator.userAgent.indexOf('iPhone') > 0){
        tilt*=-1;
    }
    if(tilt>1)tilt=1;
    if(tilt<-1)tilt=-1;
    tilt=Math.asin(tilt);
});
window.onkeydown = function (ev) {
    keysPress[ev.keyCode] = true;
}
window.onkeyup = function (ev) {
    keysPress[ev.keyCode] = false;
}
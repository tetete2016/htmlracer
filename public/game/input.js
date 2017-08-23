var keysPress=new Array(1000);
var handle=0;
var tilt=0;
window.addEventListener('devicemotion', function (event) {
    var gv = event.accelerationIncludingGravity;
    tilt=gv.x/4;
    if(navigator.userAgent.indexOf('iPad') > 0){
        tilt=-gv.x/4;
    }
    if(tilt>1)tilt=tilt*tilt;
    if(tilt<-1)tilt=-tilt*tilt;
});
window.onkeydown = function (ev) {
    keysPress[ev.keyCode] = true;
}
window.onkeyup = function (ev) {
    keysPress[ev.keyCode] = false;
}
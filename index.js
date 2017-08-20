var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cidgen=0;
var car=function(){
    this.goal=false;
    this.pos={x:0,z:0};
    this.vel={x:0,z:0};
    this.rot=0;
    this.cid=cidgen;
    this.lap=0;
    this.cp=0;
    this.acc=0;
    this.audience=false;
    cidgen++;
};
var cars=[];
//     start     end       next
//wait       race    result     wait
var state="wait";
var start;
var end;
var next;

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//join
function waitState(){
    start=new Date().getTime()+3000;
    end=start+7000;
    next=end+3000;
    state="wait";
}
//next<time
function switchState(){
    start=next+3000;
    end=start+7000;
    next=end+3000;
    state="wait";
}
app.get('/newcar', function (request, response) {
    var c=new car();
    cars.push(c);
    if(state=="wait"){
        waitState();
    }
    response.send(c.cid+"");
});
app.get('/carlist', function (request, response) {
    response.send(JSON.stringify(cars));
});
app.get('/a', function (request, response) {
    response.send("test");
});
function getcarindex(cid){
    for(var i=0;i<cars.length;i++){
        if(cars[i].cid==cid)return i;
    }
    return null;
};
app.post('/setpos', function (request, response) {
    console.log(request.body);
    var time=new Date().getTime();
    if(time>next){
        switchState();
    }else if(time>end){
        state="result";
    }else if(time>start){
        state="race";
    }else {
        state="wait";
    }
    console.log(state);
    if(request.body==null)
        response.send(JSON.stringify(cars));
    if(request.body.rot!=null&&request.body.pos!=null&&request.body.cid!=null&&request.body.acc!=null&&request.body.vel!=null){
        var cid=request.body.cid;
        var p=request.body.pos;
        var r=request.body.rot;
        var a=request.body.acc;
        var c=getcarindex(cid);
        var vx=request.body.vel.x;
        var vz=request.body.vel.z;
        console.log("carindex:"+c);
        if(c!=null){
            if(vx!=null&&vz!=null){
                cars[c].vel.x=vx;
                cars[c].vel.z=vz;
            }
            if(p.x!=null&&p.z!=null){
                cars[c].pos.x=p.x;
                cars[c].pos.z=p.z;
            }
            cars[c].rot=r;
            cars[c].acc=a;
        }
    }
    response.send(JSON.stringify(cars));
});
/*
app.post('/highscore', function (request, response) {
    console.log(request.body);
    if (request.body.name != null && request.body.score != null) {
        adddata(request.body.name, request.body.score);
        scores.push(new ScoreData(request.body.name, request.body.score));
    }
    console.log(scores);
    response.send("");
});

app.get('/highscore', function (request, response) {
    console.log(request.body);
    var str = JSON.stringify(scores);
    response.send(str);
});
*/
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
    waitState();
});
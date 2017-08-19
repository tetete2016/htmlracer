var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cidgen=0;
var car=function(){
    this.goal=false;
    this.pos={x:0,y:0};
    this.cid=cidgen;
    cidgen++;
};
var cars=[];

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/newcar', function (request, response) {
    var c=new car();
    cars.push(c);
    response.send(c.cid);
});
app.get('/carlist', function (request, response) {
    response.send(JSON.stringify(cars));
});
app.get('/a', function (request, response) {
    response.send("test");
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
});
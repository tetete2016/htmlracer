var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xeeeeff);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.zIndex = "0";
document.body.appendChild(renderer.domElement);
var order=0;
//ui
var count=document.createElement("div");
count.style.position="absolute";
count.style.width=window.innerWidth+"px";
count.style.top=(window.innerHeight/2-20)+"px";
count.style.fontSize="40px";
count.style.textAlign="center";
count.style.color="#fff";
count.style.background="linear-gradient(to right, rgba(0,0,130,0.1),rgba(0,0,130,0.7),rgba(0,0,130,0.1))";
document.body.appendChild(count);
var lap=document.createElement("div");
lap.style.position="absolute";
lap.style.zIndex="1";
lap.style.color="white";
lap.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
document.body.appendChild(lap);
var orderdiv=document.createElement("div");
orderdiv.style.position="absolute";
orderdiv.style.left=(window.innerWidth-230)+"px";
orderdiv.style.width="230px";
orderdiv.style.height="60px";
orderdiv.style.fontSize="40px";
orderdiv.style.textAlign="center";
orderdiv.style.color="#fff";
orderdiv.style.background="linear-gradient(to right, rgba(0,0,130,0.1),rgba(0,0,130,0.7),rgba(0,0,130,0.1))";
document.body.appendChild(orderdiv);
var targetList=[];
var projector = new THREE.Projector();
/*
var ray = new THREE.Raycaster(new THREE.Vector3(camera.position.x, camera.position.y - 0.5 + i, camera.position.z), new THREE.Vector3(vx, 0, vz).normalize());
var obj = ray.intersectObjects(targetList);
if (obj.length > 0) {
}
*/
var ambient=0x114477;
var sun=0xeebb88;
var camera = new THREE.PerspectiveCamera();
camera.aspect=width/height;
camera.updateProjectionMatrix();
camera.position.z = -5;
camera.position.y = 3;
camera.rotation.y=Math.PI;
var scene = new THREE.Scene();
var cp=[
    {x:0,z:0},
    {x:0,z:50},
    {x:-50,z:50},
    {x:-50,z:0},
    {x:0,z:0}
];

var carGeo = new THREE.CubeGeometry(1, 1, 1);
var carMatA = new THREE.MeshLambertMaterial( { color: 0xffffff,transparent:true,opacity:0.5} );
var carMat = new THREE.MeshLambertMaterial( { color: 0xffffff} );
var player=new Car();
player.setMesh(carGeo,carMat);

var light = new THREE.DirectionalLight(sun,2);
light.position.set(1, 1, 2).normalize();
scene.add( light );

var l2 = new THREE.AmbientLight(ambient);
scene.add( l2 );
var loader = new THREE.ObjectLoader();
loader.load("model.json",function ( obj ) {
    obj.position.set(10,0,30);
    obj.rotation.y=Math.PI/4*5;
    var mesh=obj.getChildByName("cube",true);
    targetList.push(mesh);
    scene.add( obj );
});
for(var i=-10;i<40;i++){
    addcube(-12,0,i*4);
    addcube(60,0,i*4);
}
for(var i=-10;i<40;i++){
    addcube(i*4,0,-12);
    addcube(i*4,0,62);
}
addlongcube(-5,0,0,2,1,20);
//network
var state="wait";
var start=new Date().getTime()+10000;
var end=new Date().getTime()+600000;
var next=new Date().getTime()+70000;
var sent=false;
doget(null,"/newcar",function(e){
    var data=JSON.parse(e);
    player.cid=e.cid;
    state=e.state;
    if(e.start!=null)start=e.start;
    if(e.end!=null)end=e.end;
    if(e.next!=null)next=e.next;
    //alert("your cid is "+player.cid);
});
var othercar=[];
function updatecars(cs){
    for(var i=0;i<cs.length;i++){
        var exists=false;
        for(var j=0;j<othercar.length;j++){
            if(exists)continue;
            if(othercar[j].cid==cs[i].cid){
                othercar[j].pos=cs[i].pos;
                othercar[j].vel=cs[i].vel;
                othercar[j].rot=cs[i].rot;
                othercar[j].acc=cs[i].acc;
                othercar[j].audience=cs[i].audience;
                exists=true;
            }
        }
        if(!exists&&cs[i].cid!=player.cid){
            var newcar=new Car();
            newcar.pos=cs[i].pos;
            newcar.cid=cs[i].cid;
            newcar.vel=cs[i].vel;
            newcar.rot=cs[i].rot;
            newcar.acc=cs[i].acc;
            othercar[j].audience=cs[i].audience;
            if(cs[i].audience){
                newcar.setMesh(carGeo,carMatA);
            }else{
                newcar.setMesh(carGeo,carMat);
            }
            othercar.push(newcar);
        }
    }
}

var lasttime=new Date().getTime();
var keysPress=new Array(1000);
var handle=0;
var tilt=0;
window.addEventListener('devicemotion', function (event) {
    var gv = event.accelerationIncludingGravity;
    tilt=gv.x/4;
    if(navigator.userAgent.indexOf('iPad') > 0){
        tilt=-gv.x/4;
    }
    if(tilt>1)tilt=1;
    if(tilt<-1)tilt=-1;
});
window.onkeydown = function (ev) {
    keysPress[ev.keyCode] = true;
}
window.onkeyup = function (ev) {
    keysPress[ev.keyCode] = false;
}
function rotate(x,y,r){
    var cos=Math.cos(r);
    var sin=Math.sin(r);
    var p={x:x*cos-y*sin,y:x*sin+y*cos};
    return p;
}
for(var i=0;i<cp.length;i++){

    var geometry = new THREE.CubeGeometry(1, 5, 1);
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=-cp[i].x;
    mesh.position.y=3;
    mesh.position.z=cp[i].z;
    scene.add( mesh );

}
var creatingcar=false;
var timenow=new Date().getTime();
function timer(){
    if(player.cid!=null&&!sent){
        var d={};
        d.pos=player.pos;
        d.vel=player.vel;
        d.rot=player.rot;
        d.cp=player.cp;
        d.lap=player.lap;
        d.cid=player.cid;
        d.acc=player.acc;
        dopost(JSON.stringify(d),"/setpos",function(res){
            sent=false; 
            if(res=="nocar"){
                if(creatingcar)return;
                creatingcar=true;
                doget(null,"/newcar",function(e){
                    player.cid=Number.parseInt(e);
                    creatingcar=false;
                    //alert("your cid is "+player.cid);
                });
                return;
            }
            try{
                var p=JSON.parse(res);
                updatecars(p.cars);
                //console.log(res);
                console.log(p);
                state=p.state;
                start=p.start;
                end=p.end;
                next=p.next;
            }catch(e){}
        });
        sent=true;
    }
    timenow=new Date().getTime();
    var dt=timenow-lasttime;
    dt*=0.001;
    handle=tilt;
    //lap.innerHTML=player.lap;
    if(keysPress[37]==true)handle=1;
    if(keysPress[39]==true)handle=-1;
    if(state=="wait"){
        player.reset();
    }
    if(state=="race"){
        player.rot+=handle*dt*1;
        player.acc=1;
        player.physics(dt,true);
    }else{
        player.acc=0;
    }
    player.updateMesh();
    order=0;
    for(var i=0;i<othercar.length;i++){
        if(othercar[i].cid==player.cid)continue;
        if(state=="race"){
            othercar[i].physics(dt,false);
        }
        if(state=="wait"){
            //othercar[i].reset();
        }
        othercar[i].updateMesh();
        if(othercar[i].lap>player.lap){
            order++;
        }else if(othercar[i].cp>player.cp){
            order++;
        }else if(othercar[i].cp==player.cp&&othercar[i].dsq<player.dsq){
            order++;
        }
    }
    camera.position.x=player.mesh.position.x-Math.sin(player.rot)*12;
    camera.position.y=3;
    camera.position.z=player.mesh.position.z-Math.cos(player.rot)*12;
    //camera.rotation.x=Math.PI/4;
    camera.lookAt(player.mesh.position);
    //alert(camera.rotation.x+","+camera.rotation.y+","+camera.rotation.z);
    //camera.rotation.y=0;
    //camera.lookAt(player.mesh);

    //camera.rotation.y=player.rot;
    renderer.render( scene, camera );  
    lasttime=timenow;
    ui();
    if(timenow>next){
        //switchState();
    }else if(timenow>end){
        state="result";
    }else if(timenow>start){
        state="race";
    }else {
        state="wait";
    }
    requestAnimationFrame(timer);
}timer();
function ui(){
    var laptxt=state+" ";
    if(state!=="wait"){
        if(count.style.visibility!="hidden")
            count.style.visibility="hidden";
    }
    if(state=="wait"){
        if(count.style.visibility!="visible")
            count.style.visibility="visible";
        count.innerHTML="Race will begin in "+ Math.floor((start- timenow)*0.001)+"s";
    }else if(state=="result"){
        laptxt+="next race will begin"+ Math.floor((next- timenow)*0.001)+"s";
    }else if(state=="race"){
        laptxt+="race will end "+ Math.floor((end- timenow)*0.001)+"s";
    }
    laptxt+=player.cp+"lap:"+player.lap+"order:";

    var ordertxt="";
    if(order==0){
        ordertxt="1st";
    }else if(order==1){
        ordertxt="2nd";
    }else if(order==2){
        ordertxt="3rd";
    }else{
        ordertxt=(order+1)+"th";
    }
    if(lap.innerHTML!==laptxt){
        lap.innerHTML=laptxt;
    }
    if(orderdiv.innerHTML!==ordertxt){
        orderdiv.innerHTML=ordertxt;
    }
    laptxt="";
}
function addcube(x,y,z){
    var geometry = new THREE.CubeGeometry(2, 2, 2);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
    targetList.push(mesh);
}
function addlongcube(x,y,z,sx,sy,sz){
    var geometry = new THREE.CubeGeometry(sx, sy, sz);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
    targetList.push(mesh);
}
// render
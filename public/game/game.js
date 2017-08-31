var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xeeeeff);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.zIndex = "0";
document.body.appendChild(renderer.domElement);
var order=0;
var targetList=[];
var projector = new THREE.Projector();
var ambient=0x444477;
var sun=0xbbbb88;
var camera = new THREE.PerspectiveCamera();
camera.aspect=width/height;
camera.updateProjectionMatrix();
camera.position.z = -5;
camera.position.y = 3;
camera.rotation.y=Math.PI;
var scene = new THREE.Scene();
var cp=[
    {x:0,z:0},
    {x:0,z:280},
    {x:-80,z:384},
    {x:0,z:448},
    {x:248,z:434},//-62 -108
    {x:320,z:364},
    {x:226,z:260},//-56.5 -57.5
    {x:220,z:36},
    {x:184,z:-32},
    {x:40,z:-36},
    {x:-52,z:-84},//13 21
    {x:-92,z:-40},//23 10
    {x:-60,z:-8},//15 2
    {x:-16,z:-22},//4 5.6
];

var carGeo = new THREE.CubeGeometry(1, 1, 1);
var carMatA = new THREE.MeshLambertMaterial( { color: 0xffffff,transparent:true,opacity:0.5} );
var carMat = new THREE.MeshLambertMaterial( { color: 0xffffff} );
var player=new Car();
//player.setMesh(carGeo,carMat);

var light = new THREE.DirectionalLight(sun,2);
light.position.set(1, 1, 2).normalize();
scene.add( light );

var l2 = new THREE.AmbientLight(ambient);
scene.add( l2 );
var loadstats=0;
loadstats++;
(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("models/stage.json",function ( obj ) {
        loadstats--;
        //obj.position.set(10,0,30);
        //obj.rotation.y=Math.PI/4*5;
        obj.scale.set(4,4,4);
        var mesh=obj.getChildByName("cube_Cube.001",true);
        console.log(mesh);
        console.log(mesh.children);
        targetList.push(mesh);
        scene.add( obj );
    });
})();
var carobj;
loadstats++;
var car_texture = new THREE.TextureLoader().load( "textures/tex.png" );
car_texture.wrapS = THREE.RepeatWrapping;
car_texture.wrapT = THREE.RepeatWrapping;
car_texture.repeat.set( 4, 4 );

(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("models/car.json",function ( obj ) {
        loadstats--;
        //obj.position.set(10,0,30);
        //obj.rotation.y=Math.PI/4*5;
        obj.scale.set(0.5,0.5,0.5);
        carobj=obj;
        var obj1=obj.GdeepCloneMaterials();
        scene.add(obj1);
        player.setObj(obj1);
        /*
        for(var i in obj1.children){
            console.log(i.name);
        }
        */
        //console.log(obj1.getChildByName("Cube_Cube.001",true));
        var n=10;
        if(othercar.length>n)n=othercar.length;
        for(var i=0;i<n;i++){
            var obj2=carobj.GdeepCloneMaterials();
            obj2.position.set(i+10,0,0);
            scene.add(obj2);
            if(i<othercar.length&&(!othercar[i].mesh)){
                othercar[i].setObj(obj2);
            }
        }
        console.log(obj1.children);
        /*
        for(var i=0;i<othercar.length;i++){
            var obj2=carobj.GdeepCloneMaterials();
            scene.add(obj2);
            othercar[i].setObj(obj2);
        }*/
        //player.setObj(obj);
    });
})();
/** Gives the aptitude for an object3D to clone recursively with its material cloned (normal clone does not clone material)*/

THREE.Object3D.prototype.GdeepCloneMaterials = function() {
    var object = this.clone( new THREE.Object3D(), false );

    for ( var i = 0; i < this.children.length; i++ ) {

        var child = this.children[ i ];
        if ( child.GdeepCloneMaterials ) {
            object.add( child.GdeepCloneMaterials() );
        } else {
            object.add( child.clone() );
        }

    }
    return object;
};

THREE.Mesh.prototype.GdeepCloneMaterials = function( object, recursive ) {
    if ( object === undefined ) {
        object = new THREE.Mesh( this.geometry, this.material.clone() );
    }

    THREE.Object3D.prototype.GdeepCloneMaterials.call( this, object, recursive );

    return object;
};
//network
var clientstart=null;

var state="wait";
var start=new Date().getTime()+10000;
var end=new Date().getTime()+60000;
var next=end+70000;
var sent=false;
var gameid=null;
var timediff=null;
var timedifflag=null;
var lag=null;
var senttime=null;
var neutralTime=null;

var LAP_ENDS=1;
doget(null,"/newcar",function(e){
    var d=JSON.parse(e);
    player.cid=d.cid;
    state=d.state;
    start=d.start;
    end=d.end;
    next=d.next;
    player.audience=d.audience;
    gameid=d.gameid;
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
                othercar[j].physics(lag*0.001);
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
            newcar.audience=cs[i].audience;
            if(carobj!=null){
                var obj1=carobj.GdeepCloneMaterials();
                newcar.setObj(obj1);
                scene.add(obj1);
            }
            newcar.physics(lag*0.001);
            othercar.push(newcar);
        }
    }
}
var lasttime=new Date().getTime();
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
console.log(player.pos);
function timer(){
    if(loadstats>0){
        requestAnimationFrame(timer);
        return;
    }
    timenow=new Date().getTime();
    //console.log(JSON.stringify(player.pos)+","+timenow);
    if(player.cid!=null&&!sent){
        var d={};
        d.pos=player.pos;
        d.vel=player.vel;
        d.rot=player.rot;
        d.cp=player.cp;
        d.lap=player.lap;
        d.cid=player.cid;
        d.acc=player.acc;
        d.goal=player.goal;
        senttime=timenow;
        dopost(JSON.stringify(d),"/setpos",function(res){
            lag=new Date().getTime()- senttime;
            sent=false; 
            if(res=="nocar"){
                if(creatingcar)return;
                creatingcar=true;
                return;
            }
            var p=JSON.parse(res);
            updatecars(p.cars);
            //console.log(res);
            console.log(p);
            state=p.state;
            start=p.start;
            end=p.end;
            next=p.next;
            gameid=p.gameid;
            timedifflag=p.time-senttime;
            timediff=timedifflag-lag/2;
            netdiv.innerHTML="lag:"+lag+" servertime:"+p.time+" timediff:"+timediff;
        });
        sent=true;
    }
    if(timenow>next){
        location.reload();
        return;
    }else if(timenow>end){
        state="result";
    }else if(timenow>start){
        state="race";
    }else {
        state="wait";
    }
    neutralTime=timenow-timediff;
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
            othercar[i].reset();
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
    if(player.mesh!=null){
        camera.position.x=player.mesh.position.x-Math.sin(player.rot)*12;
        camera.position.y=3;
        camera.position.z=player.mesh.position.z-Math.cos(player.rot)*12;
        //camera.rotation.x=Math.PI/4;
        camera.lookAt(player.mesh.position);
    }
    //alert(camera.rotation.x+","+camera.rotation.y+","+camera.rotation.z);
    //camera.rotation.y=0;
    //camera.lookAt(player.mesh);

    //camera.rotation.y=player.rot;
    if(lap>LAP_ENDS&&player.goal==null){
        player.goal=timenow-start;
    }
    renderer.render( scene, camera );  
    ui();
    lasttime=timenow;
    requestAnimationFrame(timer);
}timer();
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
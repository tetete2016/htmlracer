var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var ambient=0x114477;
var sun=0xeebb88;
var camera = new THREE.PerspectiveCamera();
camera.position.z = -5;
camera.position.y = 3;
camera.rotation.y=Math.PI;
var scene = new THREE.Scene();

var Car=function(){
    this.mesh=null;
    this.setMesh=function(geo,mat){
        this.mesh=new THREE.Mesh(geo,mat);
        scene.add(this.mesh);
    }
    this.pos={x:0,z:0};
    this.vel={x:0,z:0};
    this.rot=0;//radian
    this.fric=1;
    this.drag=1;
    this.acc=0;
    this.updateMesh=function(){
        this.mesh.position.x=this.pos.x;
        this.mesh.position.z=this.pos.z;
        this.mesh.rotation.y=this.rot;
    }
    this.physics=function(dt){
        this.vel.x+=dt*Math.sin(this.rot)*this.acc;
        this.vel.z+=dt*Math.cos(this.rot)*this.acc;
        this.pos.x+=this.vel.x*dt;
        this.pos.z+=this.vel.z*dt;
    }
}
var carGeo = new THREE.CubeGeometry(2, 2, 2);
var carMat = new THREE.MeshLambertMaterial( { color: 0xff0000} )
var player=new Car();
player.setMesh(carGeo,carMat);

var light = new THREE.DirectionalLight(sun,2);
light.position.set(1, 1, 2).normalize();
scene.add( light );

var l2 = new THREE.AmbientLight(ambient);
scene.add( l2 );
function addcube(x,y,z){
    var geometry = new THREE.CubeGeometry(2, 2, 2);
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=x;
    mesh.position.y=y;
    mesh.position.z=z;
    scene.add( mesh );
}
for(var i=0;i<10;i++){
    addcube(0,0,i*4);
}
var lasttime=new Date().getTime();
var keysPress=new Array(1000);
var handle=0;
function timer(){
    var timenow=new Date().getTime();
    var dt=timenow-lasttime;
    dt*=0.001;
    handle=0;
    if(keysPress[37]==true)handle=1;
    if(keysPress[39]==true)handle=-1;
    player.rot+=handle*dt*1;
    player.acc=1;
    player.physics(dt);
    player.updateMesh();
    camera.position.x=player.pos.x-Math.sin(player.rot)*30;
    camera.position.z=player.pos.z-Math.cos(player.rot)*30;
    camera.rotation.y=player.rot+Math.PI;
    console.log(player.vel);
    renderer.render( scene, camera );  
    lasttime=timenow;
    requestAnimationFrame(timer);
}timer();
window.onkeydown = function (ev) {
    keysPress[ev.keyCode] = true;
}
window.onkeyup = function (ev) {
    keysPress[ev.keyCode] = false;
}
// render
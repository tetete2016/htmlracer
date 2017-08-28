
var Car=function(){
    this.audience=false;
    this.cp=0;
    this.lap=1;
    this.mesh=null;
    this.setObj=function(obj){
        this.mesh=obj;
        console.log("setobj");
        console.log(obj);
    }
    this.setMesh=function(geo,mat){
        this.mesh=new THREE.Mesh(geo,mat);
        this.mesh.name="car"+this.cid;
        scene.add(this.mesh);
    }
    this.cid=null;
    this.pos={x:0,z:-20};
    this.vel={x:0,z:0};
    this.rot=0;//radian
    this.fric=10;
    this.drag=1;
    this.acc=0;
    this.power=5;
    this.terminalVelocity=30;
    this.reset=function(){
        this.pos={x:Math.floor(this.cid%5),z:Math.floor(this.cid/5)};
        this.vel={x:0,z:0};
        this.rot=0;
    }
    this.updateMesh=function(){
        if(this.mesh==null)return;
        this.mesh.position.x=-this.pos.x;
        this.mesh.position.z=this.pos.z;
        this.mesh.position.y=0.25;
        this.mesh.rotation.y=this.rot;
    }
    this.physics=function(dt,isplayer){
        //ma+kv=0
        //k=-ma/vel
        var drag=-this.power/this.terminalVelocity;
        var a=rotate(0,this.acc,this.rot);
        var v=Math.sqrt(this.vel.x*this.vel.x+this.vel.z*this.vel.z);
        if(!isplayer){
            /*
            this.vel.x+=dt*a.x;
            this.vel.z+=dt*a.y;
            this.vel.x+=this.vel.x*drag*dt;
            this.vel.z+=this.vel.z*drag*dt;
            return;*/
        }
        this.vel.x+=dt*a.x*this.power;
        this.vel.z+=dt*a.y*this.power;
        var v1=rotate(this.vel.x,this.vel.z,-this.rot);
        var relativeSideForce=v1.x;
        var sideforce=rotate(v1.x,0,this.rot);
        this.vel.x-=sideforce.x*dt*this.fric;
        this.vel.z-=sideforce.y*dt*this.fric;
        this.vel.x+=this.vel.x*drag*dt;
        this.vel.z+=this.vel.z*drag*dt;
        var res=8;
        var collided=false;

        for(var i=-res/2;i<res/2;i++){
            if(collided)continue;
            var rv=rotate(this.vel.x/v,this.vel.z/v,Math.PI/2/res*i);
            var ray = new THREE.Raycaster(new THREE.Vector3(-this.pos.x,0,this.pos.z), new THREE.Vector3(-rv.x, 0, rv.y).normalize());
            var obj = ray.intersectObjects(targetList);
            if (obj.length > 0) {
                var d=obj[0].distance;
                if(d<0.5){
                    this.vel.x+=-rv.x*v;
                    this.vel.z+=-rv.y*v;
                    collided=true;
                }
            } 
        }
        this.pos.x+=this.vel.x*dt;
        this.pos.z+=this.vel.z*dt;
        var relativevelX;
        var relativevelZ;
        //order
        this.checklapend();
        var tp=cp[this.cp];
        var dx=tp.x-this.pos.x;
        var dz=tp.z-this.pos.z;
        this.dsq=dx*dx+dz*dz;
        if(this.dsq<100){
            this.cp++;
            this.checklapend();
            tp=cp[this.cp];
            dx=tp.x-this.pos.x;
            dz=tp.z-this.pos.z;
            this.dsq=dx*dx+dz*dz;
        }
        //this.dsq=
    }
    this.checklapend=function(){
            if(this.cp>=cp.length){
                this.lap++;
                this.cp=1;
            }
    }
    this.goal=null;
    this.dsq=Infinity;
};

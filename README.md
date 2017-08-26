html racer
==========
This is a html5 online 3d racing game.
This runs on node of heroku, but you can change the code to run it on another server.

Getting Started
===============

3D model JSON in this game is generated using [three.js editor](https://www.threejs.org/editor/)
Import your original 3d models and push "export object" button in the file menu.

You can change the 3d model of your car by changing game/model/car.json
You may have to change this part of game.js:
```javascript
(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("models/car.json",function ( obj ) {
        //obj.position.set(10,0,30);
        //obj.rotation.y=Math.PI/4*5;
        obj.scale.set(0.5,0.5,0.5);
        carobj=obj;
        scene.add(obj);
        player.setObj(obj);
        console.log(obj.children);
        //player.setObj(obj);
    });
})();
```
To change the stage, replace this file and change the code of game.js.
```javascript
(function(){
    var loader = new THREE.ObjectLoader();
    loader.load("models/stage.json",function ( obj ) {
        //obj.position.set(10,0,30);
        //obj.rotation.y=Math.PI/4*5;
        obj.scale.set(4,4,4);
        var mesh=obj.getChildByName("cube_Cube.001",true);//Change "cube_Cube.001" to make your original mesh collidable.
        console.log(mesh);
        console.log(mesh.children);
        targetList.push(mesh);
        scene.add( obj );
    });
})();
```
Also you have to change this part in game.js to change the position of the checkpoint:
```javascript
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
```

list of codes(not all of them :P)
=================================

game.js
-------

This includes main loop, network and 3D stuff.

car.js
------
This includes car class.
The class has physics algorithm.

input.js
--------
This includes input stuffs like keyboard and device tilt.

ui.js
-----
This includes ui stuffs.
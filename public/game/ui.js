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
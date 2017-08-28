//ui
var linearGrad="linear-gradient(to right, rgba(0,0,130,0.8),rgba(0,0,130,0.7),rgba(0,0,130,0.8))";
var tdStyle="background:"+linearGrad+";border:10px;";
var count=document.createElement("div");
count.style.position="absolute";
count.style.width=window.innerWidth+"px";
count.style.top=(window.innerHeight/2-20)+"px";
count.style.fontSize="40px";
count.style.textAlign="center";
count.style.color="#fff";
count.style.zIndex="1";
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
orderdiv.style.zIndex="1";
orderdiv.style.background="linear-gradient(to right, rgba(0,0,130,0.1),rgba(0,0,130,0.7),rgba(0,0,130,0.1))";
document.body.appendChild(orderdiv);

var netdiv=document.createElement("div");
netdiv.style.position="absolute";
netdiv.style.zIndex="1";
netdiv.style.color="white";
netdiv.style.top= (window.innerHeight-50)+"px";
netdiv.style.height="50px";
netdiv.style.width="200px";
netdiv.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
document.body.appendChild(netdiv);

var resultTable=document.createElement("table");
resultTable.style.position="absolute";
resultTable.style.zIndex="1";
resultTable.style.color="white";
resultTable.style.top= (window.innerHeight/2)+"px";
resultTable.style.left= window.innerWidth/2+"px";
resultTable.style.fontSize="30px";
//resultTable.style.background="linear-gradient(to right, rgba(0,0,130,0.5),rgba(0,0,130,0.7),rgba(0,0,130,0.5))";
var tbody=document.createElement("tbody");
resultTable.appendChild(tbody);
document.body.appendChild(resultTable);
var tabletxt1="";
function ui(){
    var laptxt=state+" ";
    if(state!=="wait"){
        if(count.style.visibility!="hidden")
            count.style.visibility="hidden";
    }
    if(state=="wait"){
        if(count.style.visibility!="visible")
            count.style.visibility="visible";
        count.innerHTML="Race will begin in "+ Math.floor((start- timenow+lag)*0.001)+"s";
    }else if(state=="result"){
        laptxt+="next race will begin"+ Math.floor((next- timenow+lag)*0.001)+"s";
    }else if(state=="race"){
        laptxt+="race will end "+ Math.floor((end- timenow+lag)*0.001)+"s";
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
    if(player.goal!=null||state=="result"){
        var contentArr1=[];
        resultTable.style.visibility="visible";
        resultTable.style.top= (window.innerHeight/2-resultTable.offsetHeight/2)+"px";
        resultTable.style.left= (window.innerWidth/2-resultTable.offsetWidth/2)+"px";
        var tabletxt="";
        var sorted=[];
        for(var i=0;i<othercar.length;i++){
            sorted.push(othercar[i]);
        }
        sorted.push(player);
        sorted.some(function(a,b){
            if(a.goal!=null){
                if(b.goal==null){
                    return -1;
                }else{
                    if(b.goal>a.goal){
                        return -1;
                    }else{
                        return 1;
                    }
                }
            }
            if(b.goal!=null){
                if(a.goal==null){
                    return 1;
                }else{
                    if(a.goal>b.goal){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }
            if(a.lap>b.lap){
                return -1;
            }
            if(a.lap<b.lap){
                return 1;
            }
            if(a.cp>b.cp){
                return -1;
            }
            if(a.cp<b.cp){
                return 1;
            }
            if(a.dsq>b.dsq){
                return 1;
            }else{
                return -1;
            }
        });
        for(var i=0;i<sorted.length;i++){
            var name="player "+sorted[i].cid;
            var content=sorted[i].goal;
            if(sorted[i].cid==player.cid)name="YOU";
            contentArr1.push([name,content]);
            //contentArr1.push(["test"+i,"aaa"]);
        }
        for(var i=0;i<contentArr1.length;i++){
            tabletxt+="<tr><td style='"+tdStyle+"'>player "+contentArr1[i][0]+"</td>"+"<td style='"+tdStyle+"'>"+contentArr1[i][1]+"</td></tr>"
        }
        if(tabletxt!=tabletxt1){
            //console.log(resultTable.innerHTML);
            tbody.innerHTML=tabletxt;
        }
        tabletxt1=tabletxt;
    }else{
        resultTable.style.visibility="hidden";
    }
    laptxt="";
}
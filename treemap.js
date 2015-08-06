/**
 * Created by asus1 on 2015/8/1.
 */
var FILENAME = "data.json";
var width = 1000, height = 800;
var left = 10, top = 40;
var container = createContainer();
$.getJSON(FILENAME,function(data){
    countValue(data);
    rescale(data,data.size);
    data.x = 0;
    data.y = 0;
    data.width = width;
    data.height = height;
    calculatePosition(data,data.x,data.y,data.width,data.height,0);
    var fill = 'rgb('+~~(Math.random()*256)+','+
        ~~(Math.random()*256)+','+
        ~~(Math.random()*256)+")";
    drawTreemap(data,fill);
});


function createContainer(){
    var body = document.getElementsByTagName("body");
    var container = document.createElement("div");
    container.style.position = "relative";
    container.style.height = height+"px";
    container.style.width = width+"px";
    body[0].appendChild(container);
    return container;
}

function countValue(d){
    var i;
    var count=0;
    if(d.children != null){
        for(i=0;i<d.children.length;i++){
            count+=countValue(d.children[i]);
        }
        d.size = count;
    }
    return d.size;
}

function rescale(d,total){
    var i;
    if(d.children!=null){
        for(i=0;i< d.children.length;i++){
            rescale(d.children[i],total);
        }
    }
    d.size = d.size/total*width*height;
}

function calculatePosition(data,rx,ry,width,height,p){
    var length,
        sumValue=0,
        maxValue=data.children[p].size,
        minValue=data.children[p].size,
        value=data.children[p].size,
        recentLength=0;
    var i;
    var position = p;
    if(width>height) length=height;
    else length=width;
    do{
        sumValue+=value;
        maxValue=Math.max(value,maxValue);
        minValue=Math.min(value,minValue);
        if(++position>=data.children.length) break;
        value=data.children[position].size;
    }while(worstRatio(length,sumValue,maxValue,minValue)>
        worstRatio(length,sumValue+value,Math.max(value,maxValue),Math.min(value,minValue)));
    for(i=p;i<position;i++){
        if(width>height){
            data.children[i].x = rx;
            data.children[i].y = recentLength+ry;
            data.children[i].width = sumValue/length;
            data.children[i].height = data.children[i].size/sumValue*length;
        }
        else{
            data.children[i].x = recentLength+rx;
            data.children[i].y = ry;
            data.children[i].width = data.children[i].size/sumValue*length;
            data.children[i].height = sumValue/length;
        }
        recentLength+=data.children[i].size/sumValue*length;
        if(data.children[i].children!=null){
            calculatePosition(data.children[i],data.children[i].x,data.children[i].y,
                data.children[i].width,data.children[i].height,0);
        }
    }
    if(position<data.children.length) {
        if(width>height) {
            calculatePosition(data,rx+sumValue/length,ry,width-sumValue/length,height,position);
        }
        else {
            calculatePosition(data,rx,ry+sumValue/length,width,height-sumValue/length,position);
        }
    }
}

function worstRatio(length,sumValue,maxValue,minValue){
    return Math.max(length*length*maxValue/sumValue/sumValue,sumValue*sumValue/length/minValue/minValue);
}

function drawTreemap(data,color){
    if(data.children==null){
        drawNode(data,color);
    }
    else{
        var fill = 'rgb('+~~(Math.random()*256)+','+
            ~~(Math.random()*256)+','+
            ~~(Math.random()*256)+")";
        for(var i=0;i<data.children.length;i++){
            drawTreemap(data.children[i],fill);
        }
    }
}

function drawNode(data,color){
    var rect = document.createElement("div");
    rect.style.left = Math.round(data.x)+"px";
    rect.style.top = Math.round(data.y)+"px";
    rect.style.width = Math.round(data.width)+"px";
    rect.style.height = Math.round(data.height)+"px";
    rect.setAttribute("class","node");
    rect.innerHTML = data.name;
    rect.style.background = color;
    container.appendChild(rect);
    /*var rect = document.createElementNS(SVGNS,"rect");
    rect.setAttribute("class","node");
    rect.setAttribute("x",data.x);
    rect.setAttribute("y",data.y);
    rect.setAttribute("width",data.width);
    rect.setAttribute("height",data.height);
    rect.style.fill = color;
    rect.innerHTML = data.name;
    container.appendChild(rect);*/
}
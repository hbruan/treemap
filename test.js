var FILENAME = "data.json";
var SVGNS = "http://www.w3.org/2000/svg";
var data = {};
var width = 1000, height = 800;
$.getJSON(FILENAME,function(d){
    data = d;
});
var d = countValue(data);
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
document.write(d);
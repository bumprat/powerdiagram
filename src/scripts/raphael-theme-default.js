import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"

function psCircle(x, y, r){
  // 近似圆形，详见：stackoverflow how to create circle with bezier curves
  var cr = 0.5523*r;
  return 'M'+x+','+y+'m'+r+','+'0'
   +'c'+'0'+','+(-cr)+','+(cr-r)+','+(-r)+','+(-r)+','+(-r)
   +'c'+(-cr)+','+'0'+','+(-r)+','+(r-cr)+','+(-r)+','+r
   +'c'+'0'+','+(cr)+','+(r-cr)+','+(r)+','+(r)+','+(r)
   +'c'+(cr)+','+'0'+','+(r)+','+(cr-r)+','+(r)+','+(-r);
}

function mount(Raphael){
  Raphael.fn.pSubstation = function(x, y){
    var radius1 = 3;
    var radius2 = 5;
    var radius3 = 7;
    var paper = this;
    var psub = paper.path().attr({
      path : psCircle(x, y, radius1)+psCircle(x, y, radius2)+psCircle(x, y, radius3)
    });
    psub.attr({'stroke':'red', 'fill-opacity':0.01, 'fill':'black'});
    var isMouseover = false;
    window.glow={};
    psub.mouseover(function(){
      if(!isMouseover){
        glow = this.glow({color:'white', width:radius1, opacity:0.3});
        isMouseover = true;
      }
    })
    .mouseout(function(){
      if(isMouseover){
        glow.remove();
        isMouseover = false;
      }
    })
    .drag(onmove, onstart, onend);
    function onmove(dx, dy, x, y){
      var scale = paper.getScale();
      x = x+dx/scale;
      y = y+dy/scale;
      psub.attr({
        path : psCircle(x, y, radius1)+psCircle(x, y, radius2)+psCircle(x, y, radius3)
      });
    }
    function onstart(){

    }
    function onend(){

    }
    return psub;
  }
}

export default mount

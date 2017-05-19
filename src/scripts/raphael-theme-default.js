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
  /*
  function shapeMouseoverHandler(){
    if(_.hasIn(this, 'shapeGlow')){
      this.shapeGlow.remove();
    }
    this.shapeGlow = this.glow({color:'white', width:3, opacity:0.3});
  }
  function shapeMouseoutHandler(){
    if(_.hasIn(this, 'shapeGlow')){
      this.shapeGlow.remove();
    }
  }
  Raphael.el.mouseoverGlow = function(remove){
    var el = this;
    if(remove){
      if(_.hasIn(el, 'shapeGlow')){
        el.shapeGlow.remove();
        el.unmouseover(shapeGlowMouseoverHandler.bind(el)).unmouseout(shapeGlowMouseoutHandler.bind(el));
      }
    }else{
      el.mouseover(shapeGlowMouseoverHandler.bind(el)).mouseout(shapeGlowMouseoutHandler.bind(el));
    }
  }*/

  Raphael.el.BBox = function(show){
    var el = this;
    el._box = el._box || el.paper.rect(0,0,0,0).hide()
    .attr({
      fill: 'none',
      stroke:"white",
      'stroke-dasharray':'--',
      'stroke-linecapstring':'round',
      'stroke-width': 1/el.paper.getScale()
    });
    el._box.data('stroke-width', 2);
    if(show){
      eve.on('raphael.attr.path.'+el.id, updateBBox);
      updateBBox();
      el._box.show();
      console.log(1)
    }else{
      eve.off('raphael.attr.path.'+el.id, updateBBox);
      el._box.hide();
    }
    function updateBBox(){
      var BBox = el.getBBox();
      el._box.attr({x:BBox.x, y:BBox.y, width: BBox.width, height: BBox.height});
    }
  }

  Raphael.el.selectable = function(){
    var el = this;
    console.log(2)
    el.click(function(e){
      el.paper._selection.Clear(el);
      el.paper._selection.Push(el);
    });
  }

  Raphael.el.draggable = function(){
    var el = this;
    var origin;
    el.drag(function (dx, dy, x, y){
      var scale = paper.getScale();
      x = origin.x+dx/scale;
      y = origin.y+dy/scale;
      el.update({location:{x:x, y:y}});
    }, function(){
      origin = el.data('data').location;
    }, function(){
    });
  }

  Raphael.fn.substation = function(data){
    var paper = this;
    var radius1 = 10, radius2 = 20, radius3 = 30;
    var psub = paper.path();
    psub.data('stroke-width', 3);
    psub.selectable();
    psub.draggable();
    psub.update = (function(data){
      var data = _.defaults(data, psub.data('data'));
      var color = {'330kV':'#ff5555', '750kV':'#ffff55', '110kV':'#55ffff', '35kV' : '#55ff55'};
      this.attr({
        'path' : psCircle(data.location.x, data.location.y, radius1)
          +psCircle(data.location.x, data.location.y, radius2)
          +psCircle(data.location.x, data.location.y, radius3),
        'stroke': _.get(color, data.voltageLevel, color['35kV']),
        'fill-opacity':0.01,
        'fill':'black',
        'stroke-width': psub.data('stroke-width')/paper.getScale()
      });
      psub.data('data', data);
    }).bind(psub);
    psub.update(data);
    paper.entities.push(psub);
    return psub;
  }
}

export default mount

import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
import dataDef from './data-definitions'

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
    el.click(function(){
      eve('entity.click.'+el.id, el);
    })
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
    var radius = 10;
    var psub = paper.path();
    var defaultValue = _.fromPairs(_.map(dataDef['substation'],(p)=>[p.propName, p.defaultValue]));
    _.defaults(data, defaultValue);
    psub.data('stroke-width', 3);
    psub.data('def', 'substation');
    psub.draggable();
    psub.selectable();
    psub.update = (function(data){
      var data = _.defaults(data, psub.data('data'));
      paper.nameResolver(data, psub);
      var color = {'330kV':'#ff5555', '750kV':'#ffff55', '110kV':'#55ffff', '35kV' : '#55ff55'};
      var rings = {'330kV':3, '750kV':5, '110kV':1, '35kV' : 1};
      var path = "";
      for(var i=1; i<=_.get(rings, data.voltageLevel, rings['35kV']); i++){
        path+=psCircle(data.location.x, data.location.y, radius*i);
      }
      this.attr({
        'path' : path,
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

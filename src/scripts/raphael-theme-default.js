import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
import dataDef from './data-definitions'


function mount(Raphael){
  var color = {'330kV':'#ff5555', '750kV':'#ffff55', '110kV':'#55ffff', '35kV' : '#55ff55'};
  Raphael.fn.paintPseudo = function(){
    var paper = this;
    paper.pseudo = [];
    paper.substation({}, true);
    paper.powerline({}, true);
  }
  Raphael.fn.substation = function(data, pseudo){
    var paper = this;
    var radius = 3;
    var rings = {'330kV':3, '750kV':5, '110kV':1, '35kV' : 1};
    var shape = paper.path();
    var defaultValue = _.cloneDeep(_.fromPairs(_.map(dataDef['substation'],(p)=>[p.propName, p.defaultValue])));
    data = _.defaults(data, defaultValue);
    shape.data('stroke-width', 1);
    shape.data('data', data);
    if(pseudo){
      paper.pseudo.push(shape);
      shape.insertIntoLayer('pseudo');
      shape.alwaysFollow();
      shape.data('def', 'pointer').hide();
      shape.data('pseudo', 'substation');
    }else{
      paper.entities.push(shape);
      shape.insertIntoLayer('substation');
      shape.draggable();
      shape.selectable();
      shape.data('def', 'substation');
      var text = paper.text(0,0,"").attr({
        'stroke' : 'none',
        'font-size' : 5,
        'fill' : 'white'
      });
      text.data('font-size', 20);
      text.data('stroke-width', 1);
      text.update = function(){
        var data = shape.data('data');
        var box = shape.getBBox();
        text.attr({
          'x': data.location.x,
          'y': box.y2,
          'text' : data.name,
          //'font-size' : text.data('font-size')/text.paper.getScale(),
          'stroke-width' : text.data('stroke-width')/text.paper.getScale()
        });
      };
      shape.accessory(text);
    }
    var prevname = '';
    shape.update = function(){
      var data = shape.data('data');
      if(data.name !== prevname){
        paper.nameResolver(data, shape);
        prevname = data.name;
      }
      var path = "";
      for(var i=1; i<=_.get(rings, data.voltageLevel, rings[defaultValue.voltageLevel]); i++){
        path+=paper.psCircle(data.location.x, data.location.y, radius*i);
      }
      shape.attr({
        'path' : path,
        'stroke': _.get(color, data.voltageLevel, color[defaultValue.voltageLevel]),
        'fill-opacity':1,
        'fill':'black',
        'stroke-width': shape.data('stroke-width')/paper.getScale()
      });
      eve('pd.entity.update.'+shape.id, shape);
    };
    shape.update();
    return shape;
  }

  Raphael.fn.powerline = function(data, pseudo){
    var paper = this;
    var shape = paper.path()
    if(pseudo){
      paper.pseudo.push(shape);
      shape.insertIntoLayer('pseudo');
      shape.alwaysFollow();
      shape.data('def', 'pointer').hide();
      shape.data('pseudo', 'powerline');
      shape.data('radius', 3);
      shape.data('data', {location:{}});
      shape.attr({
        'stroke': 'none',
        'fill' : color['330kV']
      });
      shape.update = function(){
        data = shape.data('data');
        var scale = shape.paper.getScale();
        var path = paper.psCircle(data.location.x, data.location.y, shape.data('radius')/scale) + 'Z';
        shape.attr({'path':path});
      };
      shape.update();
    }else{
      var defaultValue = _.cloneDeep(_.fromPairs(_.map(dataDef['powerline'],(p)=>[p.propName, p.defaultValue])));
      data = _.defaults(data, defaultValue);
      shape.data('stroke-width', 2);
      shape.data('data', data);
      shape.insertIntoLayer('powerline');
      paper.entities.push(shape);
      shape.draggable();
      shape.selectable();
      shape.data('def', 'powerline');

      var text = paper.text(0,0,"").attr({
        'stroke' : 'none',
        'font-size' : 5,
        'fill' : 'white'
      });
      text.data('font-size', 20);
      text.data('stroke-width', 1);
      var prevname = '';
      text.update = function(){
        var data = shape.data('data');
        if(data.name !== prevname){
          paper.nameResolver(data, shape);
          prevname = data.name;
        }
        var box = shape.getBBox();
        text.attr({
          'x': box.x+box.width/2,
          'y': box.y+box.height/2,
          'text' : data.name,
          //'font-size' : text.data('font-size')/text.paper.getScale(),
          'stroke-width' : text.data('stroke-width')/text.paper.getScale()
        });
      };
      shape.accessory(text);

      shape._cpoints=[];
      shape.addPoint = function(point){
        shape.data('data').pointList.push(point);
        var np = paper.pointHandle(point, shape);
        shape._cpoints.push(np);
      }
      shape.removePoint = function(point){
        _.pull(shape.data('data').pointList, point);
        _.pull(shape._cpoints, _.find(shape._cpoints, (p)=>p.data('data')===point));
      }

      shape.update=function(){
        var pointList = shape.data('data').pointList;
        var path = paper.psPolyline(pointList);
        shape.attr({
          'path': path,
          'stroke': color[shape.data('data').voltageLevel],
          'stroke-width' : shape.data('stroke-width')/paper.getScale()
        });
        eve('pd.entity.update.'+shape.id, shape);
      };
      _.forEach(data.pointList, function(point){
        var np = paper.pointHandle(point, shape);
        shape._cpoints.push(np);
      });
      shape.update();
    }
    return shape;
  }

  Raphael.fn.pointHandle = function(data, target){
    var paper = this;
    var shape = paper.path().insertIntoLayer('BBox');
    shape.data('def', 'handler');
    shape.data('stroke-width', 1);
    shape.data('size', 10);
    shape.data('data', data);
    shape.attr({
      'stroke':'white',
      'fill' : '#aaaaaa'
    });
    shape._target = target;
    var origin;
    var dragging;
    var startPoint;
    var endPoint;
    shape.drag(function (dx, dy, x, y, e){
      if(dragging){
        var scale = shape.paper.getScale();
        var nx = origin.x + dx/scale;
        var ny = origin.y + dy/scale;
        var detect;
        shape.data('data').x=nx;
        shape.data('data').y=ny;
        if(startPoint || endPoint){
          detect = shape.paper.detectEntities(nx, ny, ['substation', 'generation']);
          if(detect.length>0){
            _.forEach(shape.paper.entities, function(e){
              e.emphisis(e===detect[0]);
            });
            startPoint && (shape._target.data('data').startSub=detect[0].data('data').name);
            endPoint && (shape._target.data('data').endSub=detect[0].data('data').name);
          }else {
            _.forEach(shape.paper.entities, function(e){
              e.emphisis(false);
            });
            startPoint && (shape._target.data('data').startSub="");
            endPoint && (shape._target.data('data').endSub="");
          }
        }
        shape.update();
      }
    }, function(x, y, e){
      origin = _.clone(shape.data('data'));
      dragging = true;
      var cpoints = shape._target._cpoints;
      var index = _.indexOf(cpoints, shape);
      startPoint = index===0?true:false;
      endPoint = !startPoint || index===(cpoints.length-1)?true:false;
    }, function(e){
      dragging = false;
    });
    shape.update = function(){
      var path = paper.psRect(shape.data('data').x, shape.data('data').y,
        shape.data('size')/paper.getScale());
      shape.attr({
        'path': path,
        'stroke-width' : shape.data('stroke-width')/paper.getScale()
      });
      shape._target.update();
    };
    shape.update();
    return shape;
  }

}

export default mount

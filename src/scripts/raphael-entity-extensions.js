import _ from "lodash"
import $ from "jquery"
import dataDef from "./data-definitions"
import jqueryMousewheel from "jquery-mousewheel"


function mount(Raphael){
  var listenOnceFlags = {};
  Raphael.el.BBox = function(show){
    // element.BBox() 更新 element.BBox(true) 更新并显示
    var el = this;
    var paper = el.paper;
    if(!el._box){
      el._box = el.paper.rect(0,0,0,0).hide().insertBefore(paper.layers.BBox)
        .attr({
          fill: 'none',
          stroke:"white",
          'stroke-dasharray':'--',
          'stroke-linecapstring':'round'
        });
      el._box._target = el;
      el._box.data('stroke-width', 1);
      el._box.update = (function (){
        if(this.data('visible')){
          var BBox = this._target.getBBox();
          var padding = 5/this._target.paper.getScale();
          this.attr({
            x:BBox.x-padding, y:BBox.y-padding,
            width: BBox.width+2*padding, height: BBox.height+2*padding,
            'stroke-width': this.data('stroke-width')/this._target.paper.getScale()
          });
          this._target.showControlPoints();
          this.show();
        }else{
          this._target.showControlPoints(false);
          this.hide();
        }
      }).bind(el._box);
    }
    (typeof show === "boolean") && el._box.data('visible', show);
    el._box.update();
  }
  Raphael.el.showControlPoints = function(show){
    var el = this;
    show = typeof show === "boolean"?show:true;
    if(el._cpoints && show){
      _.forEach(el._cpoints, function(p){
        p.show();
      });
    }else{
      _.forEach(el._cpoints, (p)=>p.hide());
    }
  }
  Raphael.el.selectable = function(){
    var el = this;
    var paper=el.paper;
    paper.registerOnce(el.node, 'click', 'pd.entity.click.'+el.id, this);
    paper.registerOnce(el.node, 'mouseout', 'pd.entity.mouseout.'+el.id, this);
    paper.registerOnce(el.node, 'mouseover', 'pd.entity.mouseover.'+el.id, this);
    if(!listenOnceFlags['selectable']){
      listenOnceFlags['selectable']=true;
      eve.on('pd.entity.click.*', function(e){
        if(!justDragged){
          if(this.paper.currentTool==='select' || this.paper.currentTool==='groupSelect'){
            if(e.shiftKey){
              this.select(true);
            }else{
              this.select();
            }
          }else if(this.paper.currentTool==='fault'){
            eve('pd.entity.noselect.' + this.id, this);
          }
        }else {
          justDragged=false;
        }
        e.stopPropagation();
      });
      eve.on('pd.entity.mouseover.*', function(){
        this.emphisis(true);
      });
      eve.on('pd.entity.mouseout.*', function(){
        this.emphisis(false);
      });
      eve.on('pd.entity.update.*', function(){
        this.BBox();
      });
      eve.on('pd.entity.select.*', function(multi){
        var el = this;
        if(!multi){
          paper._selection.Clear();
        }
        paper._selection.Push(el);
        $('#stage').focus();
      });
    }
  }
  Raphael.el.emphisis = function(on){
    var el = this;
    el._originalwidth = el._originalwidth || el.data('stroke-width');
    if(typeof on !== 'boolean' || on){
      el.data('stroke-width', el._originalwidth*3);
      el.update();
    }else{
      el.data('stroke-width', el._originalwidth);
      el.update();
    }
  }
  Raphael.el.select = function(multi){
    var el = this;
    eve('pd.entity.select.'+el.id, el, multi);
  }
  var justDragged;
  Raphael.el.draggable = function(){
    var el = this;
    var paper = el.paper;
    el.drag(function (dx, dy, x, y, e){
      eve('pd.entity.dragmove.'+el.id, el, dx, dy, x, y, e);
    }, function(x, y, e){
      eve('pd.entity.dragstart.'+el.id, el, x, y, e);
    }, function(e){
      eve('pd.entity.dragend.'+el.id, el, e);
    });
    if(!listenOnceFlags['select']){
      listenOnceFlags['select']=true;
      var origin;
      var dragging;
      eve.on('pd.entity.dragstart.*', function(x, y, e){
        if(this.paper.currentTool==='select' || this.paper.currentTool==='pan'){
          if(_.indexOf(paper._selection, this)<0 && !paper.picking){
            if(e.shiftKey){
              this.select(true);
            }else{
              this.select();
            }
          }
          dragging = true;
          origin = [];
          _.forEach(paper._selection, function(s){
            if(s.data('def')==='powerline'){
              origin.push({
                shape: s,
                start: _.cloneDeep(s.data('data').pointList)
              });
            }else{
              origin.push({
                shape: s,
                start: _.clone(s.data('data').location)
              });
            }
          })
        }
      });
      eve.on('pd.entity.dragend.*', function(e){
        if((this.paper.currentTool==='select' || this.paper.currentTool==='pan') && dragging){
        }
        dragging=false;
      });
      eve.on('pd.entity.dragmove.*', function(dx, dy, x, y, e){
        if((this.paper.currentTool==='select' || this.paper.currentTool==='pan') && dragging){
          var scale = this.paper.getScale();
          dx = dx/scale;
          dy = dy/scale;
          _.forEach(origin, function(o){
            if(o.shape.data('def')==='powerline'){
              _.forEach(o.shape.data('data').pointList, function(point, key){
                point.x = o.start[key].x + dx;
                point.y = o.start[key].y + dy;
                o.shape._cpoints[key].update();
              });
            }else{
              o.shape.data('data').location.x = o.start.x+dx;
              o.shape.data('data').location.y = o.start.y+dy;
              o.shape.update();
            }
          })
          if(dx>10 || dy>10){
            justDragged = true;
          }
        }
      });
    }
  }
  Raphael.el.alwaysFollow = function(){
    var el = this;
    var paper = el.paper;
    $(el.node).css('pointer-events', 'none');
    paper.registerOnce(paper.canvas, 'mousemove', 'pd.paper.mousemove', paper);
    eve.on('pd.paper.mousemove', function(e){
      var axis = paper.getLocationByPage(e.pageX, e.pageY);
      if(paper.currentTool===el.data('pseudo')){
        el.show();
        el.data('data').location ={x:axis.x, y:axis.y};
        el.update();
      }else{
        el.hide();
      }
    });
  }
  Raphael.el.accessory = function(shape){
    var el = this;
    shape._target = el;
    el._accessory = el._accessory || [];
    el._accessory.push(shape);
    eve.on('pd.entity.update.'+el.id, function(){
      _.forEach(el._accessory, (a)=>(a.update && a.update()));
    });
  }
  Raphael.fn.paintOnClick = function(){
    var paper = this;
    paper.registerOnce(paper.canvas, 'mousedown', 'pd.paper.mousedown', paper);
    if(!listenOnceFlags['paintOnClick']){
      listenOnceFlags['paintOnClick']=true;
      eve.on('pd.paper.mousedown', function(e){
        var paper = this;
        var axis = paper.getLocationByPage(e.pageX, e.pageY);
        var axisX = axis.x;
        var axisY = axis.y;
        if(paper.currentTool==='substation'){
          window.s = paper.substation({location:{x: axisX, y: axisY}});
          s.select();
          e.stopPropagation();
        }
        if(paper.currentTool==='powerline'){
          var overlap = paper.detectEntities(axisX, axisY, ['substation', 'generation'])[0];
          if(!paper.currentLine){
            paper.currentLine = paper.powerline();
            if(overlap){
               paper.currentLine.data('data').startSub = overlap.data('data').name;
               paper.currentLine.data('data').voltageLevel = overlap.data('data').voltageLevel;
            }
            paper.currentLine.addPoint({x:axisX, y:axisY});
            paper.currentLine.select();
          }else if(overlap){
            paper.currentLine.data('data').endSub = overlap.data('data').name;
            paper.currentLine.addPoint({x:axisX, y:axisY});
            paper.currentLine.select();
            paper.newLine();
          }else{
            paper.currentLine.addPoint({x:axisX, y:axisY});
            paper.currentLine.select();
          }
          e.stopPropagation();
        }
      })
    }
  }
  Raphael.fn.newLine = function(){
    this.currentLine = null;
  }
  Raphael.el.Remove = function(){
    var el = this;
    var paper = el.paper;
    if(_.indexOf(paper.entities, el)>=0){
      _.remove(paper.entities, (e)=>e===el);
      el._box.remove();
      if(el._cpoints){
        _.forEachRight(el._cpoints, (p)=>p.remove());
      }
      if(el._accessory){
        _.forEachRight(el._accessory, (a)=>a.remove());
      }
    }
    el.remove();
  };
  Raphael.fn.layers = function(nameArray){
    var paper = this;
    if(nameArray){
      paper._layers = _.map(nameArray, function(name){
        return paper.path().data('def', 'layer').data('layername', name);
      });
    }else{
      return _.map(paper._layers, (l)=>l.data('layername'));
    }
  }
  Raphael.el.insertIntoLayer = function(layername){
    var layer = _.find(this.paper._layers, (l)=>l.data('layername')===layername);
    this.insertBefore(layer);
    return this;
  }
}

export default mount

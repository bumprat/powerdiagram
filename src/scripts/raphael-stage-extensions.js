import _ from "lodash"
import $ from "jquery"
import dataDef from "./data-definitions"
import jqueryMousewheel from "jquery-mousewheel"
function mount(Raphael){
  Raphael.fn.getViewBox = function (){
    var vb = this.canvas.viewBox.baseVal;
    return {
      x : vb.x,
      x2 : vb.x + vb.width,
      y : vb.y,
      y2 : vb.y + vb.height,
      w : vb.width,
      h : vb.height
    };
  };
  Raphael.fn.getBound = function(){
    var topShapeBBox = this.top.getBBox();
    var bound = {
      x : topShapeBBox.x,
      x2 : topShapeBBox.x2,
      y : topShapeBBox.y,
      y2 : topShapeBBox.y2
    };
    this.forEach(function(shape){
      var box = shape.getBBox();
      bound.x = bound.x > box.x ? box.x : bound.x;
      bound.x2 = bound.x2 < box.x2 ? box.x2 : bound.x2;
      bound.y = bound.y > box.y ? box.y : bound.y;
      bound.y2 = bound.y2 < box.y2 ? box.y2 : bound.y2;
    });
    bound.w = bound.x2 - bound.x;
    bound.h = bound.y2 - bound.y;
    return bound;
  }
  Raphael.fn.getScale = function(){
    return this.width/this.getViewBox().w;
  }
  Raphael.fn.focusable = function(){
    this.registerOnce(this.canvas, 'mousedown', 'pd.paper.mousedown', this);
    eve.on('pd.paper.mousedown', function(e){
      $(this.canvas).parent().focus();
    });
  }
  Raphael.fn.showMouseLocation = function(){
    this.registerOnce(this.canvas, 'mousemove', 'pd.paper.mousemove', this);
    eve.on('pd.paper.mousemove', function(e){
      $(this.canvas).parent().focus();
      var location = this.getLocationByPage(e.pageX, e.pageY);
      execute && execute({
        type:'message',
        info:'(' + location.x.toFixed(2) + ',' + location.y.toFixed(2) +')'
      });
    });
  }
  Raphael.fn.showScale = function(){
    eve.on('pd.paper.zoom', function(scale){
      execute && execute({
        type:'message',
        info:'scale: ' + scale
      });
    });
  }
  Raphael.fn.panable = function(){
    var paper = this;
    this.registerOnce(this.canvas, 'mousedown', 'pd.paper.mousedown', this);
    this.registerOnce(this.canvas, 'mouseup', 'pd.paper.mouseup', this);
    this.registerOnce(this.canvas, 'mouseout', 'pd.paper.mouseout', this);
    this.registerOnce(this.canvas, 'mousemove', 'pd.paper.mousemove', this);
    var dragging = false;
    var previouslocation = {};
    eve.on('pd.paper.mousedown', function(e){
      if(paper.currentTool === 'pan'){
        if(e.target === this.canvas){
          dragging = true;
          previouslocation.x = e.pageX;
          previouslocation.y = e.pageY;
        };
      }
    });
    eve.on('pd.paper.mouseup', function(e){
      if(paper.currentTool === 'pan'){
        dragging = false;
      }
    });
    eve.on('pd.paper.mouseout', function(e){
      if(paper.currentTool === 'pan'){
        if(dragging && !(jQuery.contains(this.canvas,e.toElement)
          || this.canvas===e.toElement)){
          dragging = false;
        };
      }
    });
    eve.on('pd.paper.mousemove', function(e){
      if(paper.currentTool === 'pan'){
        if(dragging){
          var deltaX = e.pageX - previouslocation.x;
          var deltaY = e.pageY - previouslocation.y;
          var pvb = this.getViewBox();
          var scale = this.getScale();
          this.setViewBox(pvb.x - deltaX/scale, pvb.y - deltaY/scale,
            pvb.w, pvb.h);
          previouslocation.x = e.pageX;
          previouslocation.y = e.pageY;
        };
        eve('pd.paper.pan', this, e);
      }
    });
  }
  Raphael.fn.scalable = function(){
    var zoomFactor = 0.1, minScale = 0.5, maxScale = 20;
    var paper = this;
    this.registerOnce(this.canvas, 'mousewheel', 'pd.paper.mousewheel', this);
    eve.on('pd.paper.mousewheel', _.throttle(function(e, delta){
      // delta: 向上 1, 向下 -1, https://github.com/jquery/jquery-mousewheel
      var vb = paper.getViewBox();
      var mpl = (e.pageX - paper.canvas.getBoundingClientRect().left)/paper.width;
      var mpt = (e.pageY - paper.canvas.getBoundingClientRect().top)/paper.height;
      delta = delta * zoomFactor;
      var deltaX = Math.max(delta * vb.w, -(paper.width / minScale - vb.w));
      var deltaY = Math.max(delta * vb.h, -(paper.height / minScale - vb.h));
      deltaX = Math.min(deltaX, -(paper.width / maxScale - vb.w));
      deltaY = Math.min(deltaY, -(paper.height / maxScale - vb.h));
      if(true){
        var nvbx = vb.x + deltaX*mpl;
        var nvby = vb.y + deltaY*mpt;
        var nvbw = vb.w - deltaX;
        var nvbh = vb.h - deltaY;
        paper.setViewBox(nvbx, nvby, nvbw, nvbh);
      }
      eve('pd.paper.zoom', this, this.getScale());
    }));
  }
  Raphael.fn.resizable = function(mimicElement){
    var paper = this;
    this.registerOnce(window, 'resize', 'pd.paper.resize', this);
    eve.on('pd.paper.resize', _.throttle(function(){
      autoResize();
    },100));
    function autoResize(){
      var vb = paper.getViewBox();
      var scale = paper.getScale();
      window.mimicElement = mimicElement;
      var mw = mimicElement.getBoundingClientRect().width;
      var mh = mimicElement.getBoundingClientRect().height;
      paper.setSize(mw, mh);
      paper.setViewBox(vb.x, vb.y, mw/scale, mh/scale);
      eve('pd.paper.resize');
    }
    return autoResize;
  }
  Raphael.fn.viewAll = function(){
    var defaultPadding = 10;
    var paper = this;
    var bound = paper.getBound();
    var vbw = bound.w + 2*defaultPadding;
    var vbh = bound.h + 2*defaultPadding;
    var ratio = paper.width/paper.height;
    if(vbw/vbh > ratio){
      vbh = vbw / ratio;
    }else{
      vbw = vbh * ratio;
    }
    paper.setViewBox(bound.x-defaultPadding,
      bound.y-defaultPadding, vbw, vbh);
    eve('pd.paper.zoom', this, this.getScale());
  }
  Raphael.fn.autoUpdate = function(){
    var paper = this;
    eve.on('pd.paper.zoom', function(scale){
      _.forEach(paper.entities, function(el){
        if(el._cpoints){
          _.forEach(el._cpoints, (p)=>p.update());
        }else{
          el.update();
        }
      });
      paper._selectShape.update();
    });
  }
  Raphael.fn.getLocationByPage = function(pageX, pageY){
    var scale = this.getScale();
    var vb = this.getViewBox();
    var surfaceX = pageX - this.canvas.getBoundingClientRect().left;
    var surfaceY = pageY - this.canvas.getBoundingClientRect().top;
    var axisX = surfaceX / scale + vb.x;
    var axisY = surfaceY / scale + vb.y;
    return {x: axisX, y: axisY}
  }
  Raphael.fn.keyboard = function(){
    var paper = this;
    this.registerOnce(document.getElementById('stage'), 'keydown', 'pd.paper.keyboard', this);
    eve.on('pd.paper.keyboard', function(e){
      if(e.keyCode === 46){
        _.forEach(paper._selection, (s)=>s.Remove());
        paper._selection.Clear();
      }
    })
    $('#stage').keydown(function(e){
      eve('pd.paper.keyboard', paper, e);
    });
  };
  Raphael.fn.export = function(){
    var paper = this;
    var out = {
      substation:[],
      powerline:[],
      generation:[]
    };
    _.forEach(paper.entities, function(el){
      var type = el.data('def');
      var data = {};
      data = _.fromPairs(_.map(dataDef[type], function(prop){
        return [prop.propName, el.data('data')[prop.propName]]
      }));
      out[type].push(data);
    });
    return JSON.stringify(out);
  }
  Raphael.fn.detectEntities = function(x, y, def){
    var paper = this;
    var result = [];
    paper.forEachUpDown(function(shape){
      if(_.indexOf(paper.entities, shape)>=0){
        var typeMatch;
        def && (typeMatch = _.indexOf(def, shape.data('def'))>=0);
        def || (typeMatch = true);
        if(typeMatch){
          var box = shape.getBBox();
          if(x-box.x>=0 && x-box.x<=box.width
            && y-box.y>=0 && y-box.y<=box.height){
              result.push(shape);
            }
        }
      }
    })
    return result;
  }
  Raphael.fn.selectable = function(){
    var paper = this;
    paper._selection = [];
    paper.entities = [];
    paper._selection.Push = function(el){
      if(!paper._picking){

        paper._selection.push(el);
        eve('pd.paper.selectionChange');
        updateBBox();
      }else{
        var pick = el;
        eve('pd.paper.pick', pick);
      }
    }
    paper._selection.Pull = function(el){
      _.remove(paper._selection, (item)=>item===el);
      eve('pd.paper.selectionChange');
      updateBBox();
    }
    paper._selection.Clear = function(){
      _.remove(paper._selection, ()=>true);
      if(!paper._picking){
        eve('pd.paper.selectionChange');
      }
      updateBBox();
    }
    var updateBBox = function(){
      paper.entities.forEach(function(el){
        if(_.indexOf(paper._selection, el)>=0){
          el.BBox(true);
        }else{
          el.BBox(false);
        }
      });
    };
    eve.on('pd.paper.selectionChange', function(){
        if(paper._selection.length!==1){
          execute && execute({
            type: "change-propertyPanelData",
            info: {
              def : "none",
              val : {
              },
              target : null
            }
          });
        }else if(paper._selection.length===1){
          execute && execute({'type':'show-panel'});
          execute && execute({
            type: "change-propertyPanelData",
            info: {
              def: paper._selection[0].data('def'),
              val: paper._selection[0].data('data'),
              target: paper._selection[0]
            }
          })
        }
    });
    paper.registerOnce(paper.canvas, 'click', 'pd.paper.click');
    eve.on('pd.paper.click', function(e){
      if(!justDragged){
        if(paper.currentTool==='select'){
          paper._selection.Clear();
        }
      }else{
        justDragged = false;
      }
    });
    //======================= group selection===================
    this.registerOnce(this.canvas, 'mousedown', 'pd.paper.mousedown', this);
    this.registerOnce(this.canvas, 'mouseup', 'pd.paper.mouseup', this);
    this.registerOnce(this.canvas, 'mouseout', 'pd.paper.mouseout', this);
    this.registerOnce(this.canvas, 'mousemove', 'pd.paper.mousemove', this);
    var dragging = false;
    var origin = {};
    var justDragged;
    paper._selectShape = paper.rect().attr({
      'stroke':'white',
      'stroke-dasharray':'--'
    });
    paper._selectShape.update=function(){
      paper._selectShape.attr({'stroke-width':1/paper.getScale()});
    }
    // 防止鼠标变成编辑符号
    eve.on('pd.paper.mousedown', function(e){
      e.preventDefault();
    });
    eve.on('pd.paper.mousedown', function(e){
      if(paper.currentTool === 'select'){
        if(e.target === this.canvas){
          dragging = true;
          origin = paper.getLocationByPage(e.pageX, e.pageY);
          paper._selectShape.show();
        };
      }
    });
    eve.on('pd.paper.mouseup', function(e){
      if(paper.currentTool === 'select'){
        dragging = false;
        paper._selectShape.attr({x:0,y:0,width:0,height:0});
        paper._selectShape.hide();
      }
    });
    eve.on('pd.paper.mouseout', function(e){
      if(paper.currentTool === 'select'){
        if(dragging && !(jQuery.contains(this.canvas,e.toElement)
          || this.canvas===e.toElement)){
          dragging = false;
          paper._selectShape.attr({x:0,y:0,width:0,height:0});
          paper._selectShape.hide();
        };
      }
    });
    eve.on('pd.paper.mousemove', _.throttle(function(e){
      if(paper.currentTool === 'select'){
        if(dragging){
          var end = paper.getLocationByPage(e.pageX, e.pageY);
          var originX = Math.min(origin.x, end.x);
          var originY = Math.min(origin.y, end.y);
          var width = Math.abs(end.x-origin.x);
          var height = Math.abs(end.y-origin.y);
          var originX2 = originX + width;
          var originY2 = originY + height;
          paper._selectShape.attr({x:originX,y:originY,width:width,height:height});
          paper._selection.Clear();
          _.forEach(paper.entities, function(s){
            var box = s.getBBox();
            var f1 = originX2 > box.x && originX < box.x2;
            var f2 = originY2 > box.y && originY < box.y2;
            if(f1&&f2){
              paper._selection.Push(s);
            }else{
              paper._selection.Pull(s);
            }
          });
          if(width>10 || height>10){
            justDragged = true;
          }
        };
      }
    }, 100));
  }

  //=========================helpers============================
  var nameResolverRunning = false;
  Raphael.fn.nameResolverAsync = function(data, element){
    var paper = this;
    var defer = $.Deferred();
    if(paper.entities.length<1 || _.indexOf(paper.entities, element)===-1){
      defer.resolve();
      return defer;
    };
    function resolve(){
      var dup = true;
      while(dup){
        _.forEach(paper.entities, function(el){
          if(element!==el && el.data('data').name===data.name){
            data.name = data.name+"_1";
            dup = true;
            return false;
          }
          dup = false;
        });
      }
      defer.resolve();
    }
    function wait(){
      if(nameResolverRunning){
        window.setTimeout(wait);
      }else{
        nameResolverRunning=true;
        resolve();
        nameResolverRunning=false;
      }
    }
    wait();
    return defer;
  }
  Raphael.fn.nameResolver = function(data, element){
    var paper = this;
    if(paper.entities.length<1 || _.indexOf(paper.entities, element)===-1){
      return;
    };
    var dup = true;
    while(dup){
      _.forEach(paper.entities, function(el){
        if(element!==el && el.data('data').name===data.name){
          data.name = data.name+"_1";
          dup = true;
          return false;
        }
        dup = false;
      });
    }
  }
  Raphael.fn.psPolyline = function(pointList){
    var paper = this;
    var result = "";
    if(pointList.length === 1){
      result += paper.psCircle(pointList[0].x, pointList[0].y, 1)+'Z';
    }else{
      _.forEach(pointList, function(point, index){
        if(index === 0){
          result += "M";
        }else{
          result += "L";
        }
        result += point.x + ',' + point.y;
      });
    }
    return result;
  }
  Raphael.fn.psCircle = function (x, y, r){
    // 近似圆形，详见：stackoverflow how to create circle with bezier curves
    var cr = 0.5523*r;
    return 'M'+x+','+y+'m'+r+','+'0'
     +'c'+'0'+','+(-cr)+','+(cr-r)+','+(-r)+','+(-r)+','+(-r)
     +'c'+(-cr)+','+'0'+','+(-r)+','+(r-cr)+','+(-r)+','+r
     +'c'+'0'+','+(cr)+','+(r-cr)+','+(r)+','+(r)+','+(r)
     +'c'+(cr)+','+'0'+','+(r)+','+(cr-r)+','+(r)+','+(-r);
  }
  Raphael.fn.psRect = function (x, y, l){
    return 'M'+x+','+y+'m'+(l/2)+','+(-l/2)
      +'l'+(-l)+','+0+','
      +'l'+0+','+l+','
      +'l'+l+','+0+','
      +'l'+0+','+(-l);
  }
  Raphael.fn.forEachUpDown = function (callback, thisArg) {
      var top = this.top;
      while (top) {
          if (callback.call(thisArg, top) === false) {
              return this;
          }
          top = top.prev;
      }
      return this;
  };
  Raphael.fn.registerOnce = function(element, eventType, eventName, scope){
    $(element).data('events') || $(element).data('events', {});
    var events = $(element).data('events');
    if(_.get(events, eventType+'.'+eventName, false) === true){
      console.log('duplicated event register detected: ' + eventName );
      return;
    }else{
      _.set(events, eventType+'.'+eventName, true);
      eventType==='mousewheel' && jqueryMousewheel($);
      $(element).on(eventType, function(){
        _.spread(eve, 2)(eventName, scope, arguments);
      })
    }
  }
  Raphael.fn.pickEntity = function(callback){
    var paper = this;
    paper._picking = true;
    paper._selection.Clear();
    eve.on('pd.paper.pick', pick);
    function pick(){
      callback(this);
      window.setTimeout(function(){
        paper._picking = false;
      },1000);
      eve.off('pd.paper.pick', pick);
    }
  }
  Raphael.fn.import = function(data){
    var paper = this;
    while(paper.entities.length>0){
      paper.entities[0].Remove();
    }
    _.forEach(data.substation, function(data){
      paper.substation(data);
    })
    _.forEach(data.powerline, function(data){
      paper.powerline(data);
    })
    _.forEach(data.generation, function(data){
      paper.generation(data);
    })
  }
  var listenOnceFlags = {};
  Raphael.fn.fault = function (voltageLevel) {
    var paper = this;
    if (!listenOnceFlags['fault']) {
      listenOnceFlags['fault'] = true;
      eve.on('pd.entity.noselect.*', function () {
        if (paper.currentTool === 'fault') {
          var el = this;
          if (el.data('def') === 'substation') {
            var linesToRemove = [];
            var subName = el.data('data').name;
            console.log('移除 ' + subName);
            _.forEach(paper.entities, function (e) {
              if (e && e.data('def') === 'powerline' && e.data('data').voltageLevel === voltageLevel && _.indexOf(linesToRemove, e) < 0) {
                var data = e.data('data');
                var bind;
                if (data.startSub === subName) {
                  if (bind = paper.getEntityByName(data.startbind)) {
                    var binddata = bind.data('data');
                    var nldata = {};
                    nldata.name = data.name + "_" + binddata.name;
                    nldata.voltageLevel = data.voltageLevel;
                    nldata.startSub = data.endSub;
                    nldata.endSub = binddata.startSub === subName ? binddata.endSub : binddata.startSub;
                    nldata.startbind = data.endbind;
                    nldata.endbind = binddata.startSub === subName ? binddata.endbind : binddata.startbind;
                    nldata.pointList = [_.clone(_.nth(data.pointList, -1)), _.clone(_.nth(binddata.pointList, binddata.startSub === subName ? -1 : 0))];
                    linesToRemove.push(e);
                    linesToRemove.push(bind);
                    paper.powerline(nldata);
                  } else {
                    console.log(1);
                    var endpoint = _.nth(data.pointList, -1);
                    _.forEach(data.pointList, function (o, k) {
                      o.x -= (o.x - endpoint.x) * 0.5;
                      o.y -= (o.y - endpoint.y) * 0.5;
                    });
                    e.update();
                  }
                }
                if (e.data('data').endSub === subName) {
                  if (bind = paper.getEntityByName(data.endbind)) {
                    var binddata = bind.data('data');
                    var nldata = {};
                    nldata.name = data.name + "_" + binddata.name;
                    nldata.voltageLevel = data.voltageLevel;
                    nldata.startSub = data.startSub;
                    nldata.endSub = binddata.startSub === subName ? binddata.endSub : binddata.startSub;
                    nldata.startbind = data.startbind;
                    nldata.endbind = binddata.startSub === subName ? binddata.endbind : binddata.startbind;
                    nldata.pointList = [_.clone(_.nth(data.pointList, 0)), _.clone(_.nth(binddata.pointList, binddata.startSub === subName ? -1 : 0))];
                    linesToRemove.push(e);
                    linesToRemove.push(bind);
                    paper.powerline(nldata);
                  } else {
                    var startPoint = _.nth(data.pointList, 0);
                    _.forEach(data.pointList, function (o, k) {
                      o.x -= (o.x - startPoint.x) * 0.5;
                      o.y -= (o.y - startPoint.y) * 0.5;
                    });
                    e.update();
                  }
                }
              }
            });
            _.forEach(linesToRemove, function (l) {
              return l.Remove();
            });
          }
        }
      });
    }
  };
  Raphael.fn.getEntityByName = function(name){
    var paper = this;
    return _.find(paper.entities, (e)=>e.data('data').name===name);
  }
}

export default mount;

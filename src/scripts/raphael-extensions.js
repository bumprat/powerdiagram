import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
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
    // 使用 x 方向的缩放作为single source of truth
    var paper = this;
    var pvb = paper.getViewBox();
    var scaleX = paper.width/pvb.w;
    //var scaleY = paper.height/pvb.h;
    //var scale = Math.min(scaleX, scaleY);
    var scale = scaleX;
    return scale;
  }
  Raphael.fn.panable = function(){
      var dragging = false;
      var paper = this;
      var previouslocation = {};
      $(paper.canvas).bind('mousedown', function(e){
        if(e.target == paper.canvas){
          dragging = true;
        previouslocation.x = e.screenX;
        previouslocation.y = e.screenY;
        };
      })
      .bind('mouseup', function(e){
        if(dragging){
          dragging = false;
        };
      })
      /*.bind('mouseout', function(e){
        if(dragging && false){
          console.log('out')
          dragging = false;
        };
      })*/
      .bind('mousemove', function(e){
        if(dragging){
          var deltaX = e.screenX - previouslocation.x;
          var deltaY = e.screenY - previouslocation.y;
          var pvb = paper.getViewBox();
          var scale = paper.getScale();
          paper.setViewBox(pvb.x - deltaX/scale, pvb.y - deltaY/scale,
            pvb.w, pvb.h);
          previouslocation.x = e.screenX;
          previouslocation.y = e.screenY;
        };
      });
  }
  Raphael.fn.scalable = function(){
    var zoomFactor = 0.1, minScale = 0.1;
    jqueryMousewheel($);
    var paper = this;
    var p = paper.canvas;
    $(p).bind('mousewheel', _.throttle(function(e, delta){
      // delta: 向上 1, 向下 -1, https://github.com/jquery/jquery-mousewheel
      var vb = paper.getViewBox();
      var mpl = (e.pageX - $(p).offset().left)/paper.width;
      var mpt = (e.pageY - $(p).offset().top)/paper.height;
      delta = delta * zoomFactor;
      var deltaX = delta * vb.w;
      var deltaY = delta * vb.h;
      if(vb.w - deltaX < paper.width / minScale
        && vb.h - deltaY < paper.height / minScale
        && vb.w - deltaX > 0
        && vb.h - deltaY > 0){
        var nvbx = vb.x + deltaX*mpl;
        var nvby = vb.y + deltaY*mpt;
        var nvbw = vb.w - deltaX;
        var nvbh = vb.h - deltaY;
        paper.setViewBox(nvbx, nvby, nvbw, nvbh);
      }
      e.preventDefault();
    }));
  }
  Raphael.fn.resizable = function(mimicElement){
    var paper = this;
    $(window).resize(_.throttle(function(){
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
  }

}

export default mount

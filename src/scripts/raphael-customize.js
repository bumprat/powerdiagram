import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
import ext from "./raphael-extensions"
import theme from "./raphael-theme-default"

var stage,
    paper;

var defaultPadding = 10;

ext(Raphael);
theme(Raphael);

function raphaelInit(){
  console.log('raphael init...')
  stage = document.getElementById('stage');
  window.stage = stage;
  paper = Raphael('stage');
  window.paper = paper;
  paper.pSubstation(350, 170, paper);
  paper.pSubstation(100, 170, paper);
  paper.pSubstation(200, 200, paper);

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

  paper.panable();
  paper.scalable();
  paper.resizable();
}

export default _.once(raphaelInit);

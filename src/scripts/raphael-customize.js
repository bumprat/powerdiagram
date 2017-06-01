import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
import entityExt from "./raphael-entity-extensions"
import stageExt from "./raphael-stage-extensions"
import themeExt from "./raphael-theme-default"
import dataDef from "./data-definitions"
window.Raphael = Raphael;

var stage,
    paper;
entityExt(Raphael);
themeExt(Raphael);
stageExt(Raphael);

function raphaelInit(){
  stage = document.getElementById('stage');
  window.stage = stage;
  paper = Raphael('stage');
  paper.layers(['label', 'powerline', 'generation', 'substation', 'BBox', 'pseudo']);
  _.forOwn(paper.layers, (o)=>o.update=function(){});
  paper.panable();
  paper.scalable();
  paper.resizable($('.middle')[0])();
  paper.selectable();
  paper.paintPseudo();
  paper.focusable();
  paper.keyboard();
  paper.paintOnClick();
  paper.showMouseLocation();
  paper.autoUpdate();
  paper.showScale();
  var sub = paper.substation({
  });
  paper.viewAll();
  return paper;
}


export default _.once(raphaelInit);

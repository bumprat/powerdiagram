import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
import ext from "./raphael-extensions"
import theme from "./raphael-theme-default"
import dataDef from "./data-definitions"
window.Raphael = Raphael;

var stage,
    paper;


ext(Raphael);
theme(Raphael);

function raphaelInit(){
  console.log('raphael init...')
  stage = document.getElementById('stage');
  window.stage = stage;
  paper = Raphael('stage');
  window.paper = paper;
  paper.panable();
  paper.scalable();
  paper.resizable($('.middle')[0])();
  paper.selectable();
  var psub = paper.substation({
    name: "厂站1",
    location: {x: 100, y: 100}
  });
  var psub = paper.substation({
    voltageLevel: "110kV"
  });
  psub.update({voltageLevel: "35kV"});
  window.psub=psub;
  paper.viewAll();
}


export default _.once(raphaelInit);

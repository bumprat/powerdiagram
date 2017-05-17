import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"
import ext from "./raphael-extensions"
import theme from "./raphael-theme-default"

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
  paper.resizable($('#sizeTracker')[0])();
  paper.pSubstation(350, 170, paper);
  paper.pSubstation(100, 170, paper);
  paper.pSubstation(200, 200, paper);
  paper.viewAll();
}

export default _.once(raphaelInit);

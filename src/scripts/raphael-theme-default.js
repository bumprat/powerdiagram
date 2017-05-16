import Raphael from "raphael"
import _ from "lodash"
import $ from "jquery"

function mount(Raphael){
  Raphael.fn.pSubstation = function(x, y){
    var paper = this;
    var sub = paper.set();
    sub.push(
      paper.circle(x, y, 3),
      paper.circle(x, y, 6),
      paper.circle(x, y, 9)
    );
    sub.attr({stroke:'red'});
    return sub;
  }
}

export default mount

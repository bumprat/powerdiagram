import React from 'react';

class StatusBar extends React.Component{
  render(){
    return (
      <div className="statusbar-container">
        <p>当前工具: {
          _.map(this.props.currentTool, function(o, k){
            return '[' + k + ']' + o;
          }).join(' ')
        }</p>
      </div>
    );
  }
}

export default StatusBar;

import React from 'react';
import Toolbar from './components/toolbar';
import StatusBar from './components/status-bar';
import _ from 'lodash';
import raphaelInit from "./raphael-customize";
import PropertyPanel from "./components/property-panel";

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTool : {
        "绘制" : "选择"
      },
      showPanel : false
    }
    this.execute = this.execute.bind(this);
  }

  execute(cmd){
    if(cmd.type === 'radio-button-click'){
      // 切换所选工具，支持工具分组
      var ct = _.set(this.state.currentTool, cmd.info.group, cmd.info.toolName);
      this.setState({
        currentTool : ct
      });
      return false;
    }else if(cmd.type === 'hide-panel'){
      this.setState({showPanel : false});
    }else if(cmd.type === 'show-panel'){
      this.setState({showPanel : true});
    }else if(cmd.type === 'toggle-panel'){
      this.setState({showPanel : !this.state.showPanel});
    }
  }

  render(){
    return (
      <div className="page">
        <div className="toolbar">
          <Toolbar currentTool={this.state.currentTool} onCommand={this.execute}/>
        </div>
        <div className="middle">
          <div id="stage">
          </div>
          <div id="sizeTracker"></div>
        </div>
        <div className="statusbar">
          <StatusBar currentTool={this.state.currentTool}/>
        </div>
        <PropertyPanel onCommand={this.execute} show={this.state.showPanel}/>
      </div>
    );
  }

  componentDidMount(){
    raphaelInit();
  }
}

export default App;

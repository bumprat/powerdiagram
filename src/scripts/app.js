import React from 'react';
import Toolbar from './components/toolbar';
import StatusBar from './components/status-bar';
import _ from 'lodash';
import raphaelInit from "./raphael-customize";

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTool : {
        "绘制" : "选择"
      }
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
    }
  }

  render(){
    return (
      <div className="container-fluid page">
        <div className="row toolbar">
          <Toolbar currentTool={this.state.currentTool} onCommand={this.execute}/>
        </div>
        <div className="row middle">
          <div className="svg rounded" id="stage">
          </div>
        </div>
        <div className="row status-bar">
          <StatusBar currentTool={this.state.currentTool}/>
        </div>
      </div>
    );
  }

  componentDidMount(){
    raphaelInit();
  }
}

export default App;

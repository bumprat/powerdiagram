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
      showPanel : false,
      message : "无信息",
      propertyPanelData : {
        def : "none",
        val : {
        },
        target : null
      }
    }
    window.execute = this.execute = this.execute.bind(this);
  }

  execute(cmd){
    if(cmd.type === 'radio-button-click'){
      // 切换所选工具，支持工具分组
      var ct = _.set(this.state.currentTool, cmd.info.group, cmd.info.toolName);
      this.setState({
        currentTool : ct
      });
      this.setState({message:"选择工具:【"+cmd.info.group+"】"+cmd.info.toolName});
      return;
    }else if(cmd.type === 'hide-panel'){
      this.setState({showPanel : false});
      return;
    }else if(cmd.type === 'show-panel'){
      this.setState({showPanel : true});
      return;
    }else if(cmd.type === 'toggle-panel'){
      this.setState({showPanel : !this.state.showPanel});
      return;
    }else if(cmd.type === 'change-propertyPanelData'){
      this.setState({propertyPanelData : cmd.info});
      this.setState({message:"更改对象属性"});
      return;
    }
    this.setState({message:cmd.type});
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
          <StatusBar message={this.state.message}/>
        </div>
        <PropertyPanel onCommand={this.execute} show={this.state.showPanel}
          data={this.state.propertyPanelData}/>
      </div>
    );
  }

  componentDidMount(){
    raphaelInit();
  }
}

export default App;

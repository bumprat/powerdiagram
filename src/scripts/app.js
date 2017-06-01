import React from 'react';
import Toolbar from './components/toolbar';
import StatusBar from './components/status-bar';
import _ from 'lodash';
import raphaelInit from "./raphael-customize";
import PropertyPanel from "./components/property-panel";
import PortPanel from "./components/port-panel";
import {defaultData} from './data-definitions';
import xinyiData from '../../sampleData';

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
      },
      portdata: "",
      port: "import",
      show: false
    }
    window.execute = this.execute = this.execute.bind(this);
    this.paper = null;
  }

  execute(cmd){
    if(cmd.type === 'radio-button-click'){
      // 切换所选工具，支持工具分组
      var ct = _.set(this.state.currentTool, cmd.info.group, cmd.info.toolName);
      this.setState({
        currentTool : ct
      });
      this.setState({message:"选择工具:【"+cmd.info.group+"】"+cmd.info.toolName});
      _.forEach(this.paper.pseudo, (o)=>o.hide());

      if(cmd.info.group === '绘制'){
        if(cmd.info.toolName==='选择'){
          this.paper.currentTool = 'select';
          this.paper.newLine();
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='变电站'){
          this.paper.currentTool = 'substation';
          this.paper.newLine();
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='输电线'){
          this.paper.currentTool = 'powerline';
          this.paper.newLine();
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='平移'){
          this.paper.currentTool = 'pan';
          this.paper.newLine();
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='放大'){
          this.paper.currentTool = 'pan';
          this.paper.zoom(false);
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='缩小'){
          this.paper.currentTool = 'pan';
          this.paper.zoom(true);
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='330故障'){
          this.paper.currentTool = 'fault';
          this.paper.fault('330kV');
          this.paper.newLine();
        }
        if(cmd.info.group === '绘制' && cmd.info.toolName==='750故障'){
          this.paper.currentTool = 'fault';
          this.paper.fault('750kV');
          this.paper.newLine();
        }
        return;
      }
    }
    if(cmd.type === 'hide-panel'){
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
    }else if(cmd.type === 'button-click' ){
      if( cmd.info.toolName === "导出"){
        this.setState({
          showPort:true,
          portdata : this.paper.export(),
          port:"export"
        });
        return;
      }else if(cmd.info.toolName === "导入"){
        this.setState({
          showPort:true,
          port:"import"
        });
      }else if(cmd.info.toolName === "加载默认接线"){
        this.setState({showPort:false});
        this.paper.import(defaultData);
        this.paper.viewAll();
        return;
      }
    }else if(cmd.type === 'import-from-portPanel'){
      this.setState({showPort:false});
      this.paper.import($.parseJSON(this.state.portdata));
      this.paper.viewAll();
      return;
    }else if(cmd.type === 'hide-portPanel'){
      this.setState({showPort:false});
      return;
    }else if(cmd.type === 'import-text-change'){
      this.setState({portdata:cmd.info});
      return;
    }else if(cmd.type === 'message'){
      this.setState({message:cmd.info});
      return;
    }else if(cmd.type === 'pick'){
      this.paper.pickEntity(cmd.info);
      this.execute({type:'radio-button-click', info:{
        group:"绘制",
        toolName:"选择"
      }});
      return;
    }
  }

  render(){
    return (
      <div className="page">
        <div className="toolbar">
          <Toolbar currentTool={this.state.currentTool} onCommand={this.execute}/>
        </div>
        <div className="middle">
          <div id="stage" tabIndex="0">
          </div>
          <div id="sizeTracker"></div>
        </div>
        <div className="statusbar">
          <StatusBar message={this.state.message}/>
        </div>
        <PropertyPanel onCommand={this.execute} show={this.state.showPanel}
          data={this.state.propertyPanelData}/>
        <PortPanel data={this.state.portdata} onCommand={this.execute} type={this.state.port} show={this.state.showPort}/>
      </div>
    );
  }

  componentDidMount(){
    var paper = raphaelInit();
    paper.currentTool = 'select';
    window.devpaper = this.paper = paper;
    this.setState({showPort:false});
    this.paper.import(xinyiData);
    this.paper.viewAll();
    return;
  }
}

export default App;

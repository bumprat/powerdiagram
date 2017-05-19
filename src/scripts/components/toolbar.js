import React from 'react';
import ToolbarRadioButton from './toolbar-radio-button';
import PropTypes from 'prop-types';

class Toolbar extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="toolbar-container">
        <div className="toolbar-group">
          <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} group="绘制" content="选择"/>
          <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} group="绘制" content="变电站"/>
        </div>
        <div className="toolbar-group">
          <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} group="绘制" content="输电线"/>
          <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} group="绘制" content="发电厂"/>
          <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} group="绘制" content="故障"/>
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  currentTool : PropTypes.object,
  onCommand : PropTypes.func.isRequired
}

export default Toolbar;

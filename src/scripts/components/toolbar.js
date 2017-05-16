import React from 'react';
import ToolbarRadioButton from './toolbar-radio-button';
import PropTypes from 'prop-types';

class Toolbar extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="col-xs-12 ">
        <div className="btn-toolbar" role="toolbar">
          <div className="btn-group">
            <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} glyphicon="glyphicon-th" group="绘制" content="选择"/>
            <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} glyphicon="glyphicon-map-marker" group="绘制" content="变电站"/>
            <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} glyphicon="glyphicon-resize-horizontal" group="绘制" content="输电线"/>
            <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} glyphicon="glyphicon-certificate" group="绘制" content="发电厂"/>
            <ToolbarRadioButton handleClick={this.props.onCommand} currentTool={this.props.currentTool} glyphicon="glyphicon-remove" group="绘制" content="故障"/>
          </div>
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

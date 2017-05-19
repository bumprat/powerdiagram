import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ToolbarRadioButton extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    this.props.handleClick({
      type : 'radio-button-click',
      info : {
        group : this.props.group,
        toolName : this.props.content
      }
    });
  }

  render(){
    return (
      <a href="#" className={'toolbar-radio-button '
        + ((_.get(this.props.currentTool, this.props.group) === this.props.content)?'active':'')}
        onClick={this.handleClick}>
        <span className="hidden-xs"> {this.props.content}</span>
      </a>
    );
  }
}

ToolbarRadioButton.defaultProps = {
  glyphicon : 'glyphicon-hand-up',
  content : '状态按钮',
  currentTool : '未设置'
};

ToolbarRadioButton.propTypes = {
  content : PropTypes.string,
  currentTool : PropTypes.object,
  handleClick : PropTypes.func
}

export default ToolbarRadioButton;

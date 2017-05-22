import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ToolbarButton extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    this.props.handleClick({
      type : 'button-click',
      info : {
        group : this.props.group,
        toolName : this.props.content
      }
    });
  }

  render(){
    return (
      <a href="#" className='toolbar-button' onClick={this.handleClick}>
        {this.props.content}
      </a>
    );
  }
}

ToolbarButton.defaultProps = {
  content : '按钮'
};

ToolbarButton.propTypes = {
  content : PropTypes.string,
  handleClick : PropTypes.func
}

export default ToolbarButton;

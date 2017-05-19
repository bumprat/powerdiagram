import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class PropertyPanel extends React.Component{

  constructor(props){
    super(props);
    this.hidePanel = this.hidePanel.bind(this);
    this.showPanel = this.showPanel.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    window.showPanel = this.showPanel.bind(this);
    window.hidePanel = this.hidePanel.bind(this);
    window.togglePanel = this.togglePanel.bind(this);
    this.state={
      show: false
    };
  }

  hidePanel(){
    //$('#propertyPanel').stop().animate({right: '-340px'}, 200, 'swing');
    this.props.onCommand({type: 'hide-panel'});
  }

  showPanel(){
    //$('#propertyPanel').stop().animate({right: '0px'}, 200, 'swing');
    this.props.onCommand({type: 'show-panel'});
  }

  togglePanel(){
    this.props.onCommand({type: 'toggle-panel'});
  }

  render(){
    return (
      <div id="propertyPanel" className={this.props.show?'show':'hide'}>
        <div className="close"><a href="#" onClick={this.togglePanel}>{this.props.show?'x':'属性窗口'}</a></div>
        <div className="top">
          <div className="title">123</div>
        </div>
        <div className="middle">

        </div>
        <div className="bottom">
          属性页
        </div>
      </div>
    );
  }
}

PropertyPanel.protapTypes = {
  data : PropTypes.object
}

export default PropertyPanel;

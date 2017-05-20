import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class PropertyPanelPoint extends React.Component{

  constructor(props){
    super(props);
    this.changeX = this.changeX.bind(this);
    this.changeY = this.changeY.bind(this);
  }
  changeX(e){
    if(!isNaN(e.target.value)){
      this.props.onChangeData(this.props.def.propName + '.x', Number(e.target.value));
    }
  }
  changeY(e){
    if(!isNaN(e.target.value)){
      this.props.onChangeData(this.props.def.propName + '.y', Number(e.target.value));
    }
  }
  render(){
    return (
      <div>
        <div className="location-x">
          <div className="label">
          x:
          </div>
          <input type="text" value={Math.round(this.props.data.x*100)/100} onChange={this.changeX}/>
        </div>
        <div className="location-y">
          <div className="label">
          y:
          </div>
          <input type="text" value={Math.round(this.props.data.y*100)/100} onChange={this.changeY}/>
        </div>
      </div>
    );
  }
}

export default PropertyPanelPoint;

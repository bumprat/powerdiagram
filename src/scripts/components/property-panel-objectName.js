import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class PropertyPanelObjectName extends React.Component{

  constructor(props){
    super(props);
    this.change = this.change.bind(this);
    this.pick = this.pick.bind(this);
  }
  change(e){
    this.props.onChangeData(this.props.def.propName, e.target.value);
  }
  pick(){
    this.props.onPick(this.props.def.propName);
  }
  render(){
    return (
      <div className='objectName'>
        <input className='objectNameInput' type="text" value={this.props.data} onChange={this.change} />
        <a className='objectNameSelect' onClick={this.pick}>选取</a>
      </div>
    );
  }
}

export default PropertyPanelObjectName;

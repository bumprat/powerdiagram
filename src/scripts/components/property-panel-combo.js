import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class PropertyPanelCombo extends React.Component{

  constructor(props){
    super(props);
    this.change = this.change.bind(this);
  }
  change(e){
    this.props.onChangeData(this.props.def.propName, e.target.value);
  }
  render(){
    var options = _.map(this.props.def.valEnum.split('|'), function(v){
      return (<option key={v} value={v}>{v}</option>);
    });
    return (
      <div>
        <select className="full" value={this.props.data} onChange={this.change}>
          {options}
        </select>
      </div>
    );
  }
}

export default PropertyPanelCombo;

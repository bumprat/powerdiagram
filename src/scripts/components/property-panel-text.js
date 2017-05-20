import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class PropertyPanelText extends React.Component{

  constructor(props){
    super(props);
    this.change = this.change.bind(this);
  }
  change(e){
    this.props.onChangeData(this.props.def.propName, e.target.value);
  }
  render(){
    return (
      <div>
        <input type="text" className="full" value={this.props.data} onChange={this.change} />
      </div>
    );
  }
}

export default PropertyPanelText;

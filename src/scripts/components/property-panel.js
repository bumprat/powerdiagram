import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dataDef from '../data-definitions';
import PropertyPanelPoint from './property-panel-point';
import PropertyPanelCombo from './property-panel-combo';
import PropertyPanelText from './property-panel-text';

class PropertyPanel extends React.Component{

  constructor(props){
    super(props);
    this.hidePanel = this.hidePanel.bind(this);
    this.showPanel = this.showPanel.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.changeData = this.changeData.bind(this);
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

  changeData(path, value){
    var el = this.props.data.target;
    var data = el.data('data');
    _.set(data, path, value);
    el.update(data);
    window.execute({
      type: "change-propertyPanelData",
      info: {
        def: el.data('def'),
        val: el.data('data'),
        target: el
      }
    })
    el.BBox(true);
  }

  render(){
    var propertyItems=[];
    var self = this;
    _.forOwn(this.props.data.val, function(value, key){
      var def = _.get(_.filter(dataDef[self.props.data.def],
        _.iteratee({propName: key})),'[0]',{});
      var sortOrder = _.indexOf(dataDef[self.props.data.def], def);
      if(def.propType === 'point'){
        propertyItems.push({
          item:(
          <div className="propertyItem" key={key} >
            <div className='propertyLabel'>{def.propChName}</div>
            <PropertyPanelPoint data={value} def={def}
            onChangeData={self.changeData} />
          </div>),
          sortOrder: sortOrder
          }
        );
      }else if(def.propType === 'enum'){
        propertyItems.push({
          item:(
          <div className="propertyItem" key={key} >
            <div className='propertyLabel'>{def.propChName}</div>
            <PropertyPanelCombo data={value} def={def}
            onChangeData={self.changeData} />
          </div>),
          sortOrder: sortOrder
          }
        );
      }else if(def.propType === 'string'){
        propertyItems.push({
          item:(
          <div className="propertyItem" key={key} >
            <div className='propertyLabel'>{def.propChName}</div>
            <PropertyPanelText data={value} def={def}
            onChangeData={self.changeData} />
          </div>),
          sortOrder: sortOrder
          }
        );
      }
    });
    propertyItems = _.map(_.sortBy(propertyItems, _.iteratee('sortOrder')), (o)=>o.item);
    return (
      <div id="propertyPanel" className={this.props.show?'show':'hide'}>
        <div className="close"><a href="#" onClick={this.togglePanel}>{this.props.show?'隐藏':'属性窗口'}</a></div>
        <div className="scroll">
          <div className="padding">
            <div className="top">
              <div className="title">{this.props.data.val.name}</div>
            </div>
            <div className="middle">
              {propertyItems}
            </div>
            <div className="bottom">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PropertyPanel.propTypes = {
  onCommand : PropTypes.func.isRequired,
  show : PropTypes.bool,
  data : PropTypes.object.isRequired
}

export default PropertyPanel;

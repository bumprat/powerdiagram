import React from 'react';

class PortPanel extends React.Component{
  constructor(props){
    super(props);
    this.import = this.import.bind(this);
    this.hide = this.hide.bind(this);
    this.change = this.change.bind(this);
  }

  import(){
    this.props.onCommand({
      type: 'import-from-portPanel'
    });
  }

  hide(){
    this.props.onCommand({
      type: 'hide-portPanel',
      info: ''
    });
  }

  change(e){
    this.props.onCommand({
      type: 'import-text-change',
      info: e.target.value
    });
  }

  render(){
    return (
      <div className={"portPanel " + (this.props.show ? '' : 'hide' )}>
        <div className="port">
          <textarea id="port" onChange={this.change} value={this.props.data}></textarea>
        </div>
        <div className="portPanelControls">
          {this.props.type==="import" &&  (<a href="#" onClick={this.import}>导入</a>)}
          <a href="#" onClick={this.hide}>收起</a>
        </div>
      </div>
    );
  }
}

export default PortPanel;

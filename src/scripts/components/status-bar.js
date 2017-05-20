import React from 'react';

class StatusBar extends React.Component{
  render(){
    return (
      <div className="statusbar-container">
        <p>{this.props.message}</p>
      </div>
    );
  }
}

export default StatusBar;

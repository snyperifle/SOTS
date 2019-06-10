import React from 'react';
//=============================================================
class RoutesToTelogis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  //=============================================================
  componentDidMount(){

  }
  //=============================================================
  
  //=============================================================
  render() {
    console.log(`Render RoutesToTelogis`, this.props);
    return (
      <div style={{ margin: 20 }}>
        <h2>Routes Not Flowing to Telogis</h2>
      </div>
    )
  }
}
export default RoutesToTelogis;
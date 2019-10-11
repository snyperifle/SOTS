import React from 'react';
class STSHostUpgrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    console.log(`Render STSHostUpgrade`, this.props);
    return (
      <div>
        STSHostUpgrade
<button onClick={() => { console.log(this.state) }} >STSHostUpgrade State</button>
        <button onClick={() => { console.log(this.props) }} >STSHostUpgrade Props</button>
      </div>
    )
  }
}
export default STSHostUpgrade;
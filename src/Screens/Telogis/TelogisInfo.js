import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
//=============================================================
class TelogisInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'For Telogis help, please reach out to "Verizon Connect Support".\nEmail: Support@srv.verizonconnect.com OR syscosupport@telogis.com\n24/7 Phone: (866)884-8538\n'
    };
  }
  render() {
    return (
      <div>
        <h2>Telogis Information</h2>
        <h5>Email this message to Caller</h5>
        <CopyToClipboard
          text={this.state.message}
        >
          <button>Copy</button>
        </CopyToClipboard>
      </div>
    )
  }
}
export default TelogisInfo;
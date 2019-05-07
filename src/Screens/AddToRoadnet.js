import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';

class AddToRoadnet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cleanupEmail: 'We have an ongoing cleanup activity for the Roadnet Environment. Please let me know who the new users are replacing.',
      cleanupCopied: false,
      addedEmail:
        'Access to Roadnet Enterprise is provided for the below credentials. On successful login, you will be prompted to change your password.\n' +
        `User ID: ${this.props.userId}\n` +
        'Password (all lowercase): sysco123',
      addedCopied: false,
    };
  }
  render() {
    return (
      <div>
        <ol>
          <li>
            <h3>Email this message to requester:</h3>
            <h4>{this.state.value}</h4>
            <CopyToClipboard
              text={this.state.cleanupEmail} onCopy={() => this.setState({ cleanupCopied: true, addedCopied: false })}>
              <button>Copy</button>
            </CopyToClipboard>
            {this.state.cleanupCopied === true ? <h4>Message Copied</h4> : null}
          </li>
          <li>
            <h3>Assign incident to "Security Admin"</h3>
          </li>
          <li>
            <h3>Go to <a href={'https://myoffice.sysco.com/Citrix/Internal/'}> Roadnet Enterprise</a></h3>
            <ul>
              <li>
                <h4>Administration => Lists => User</h4>
              </li>
              <li>
                <h4>Add user and Add user to group</h4>
              </li>
            </ul>
          </li>
          <li>
            <h3>Email this message to requester:</h3>
            <CopyToClipboard
              text={this.state.addedEmail} onCopy={() => this.setState({ addedCopied: true, cleanupCopied: false })}
            >
              <button>Copy</button>
            </CopyToClipboard>
          </li>
        </ol>
      </div >
    )
  }
}
export default AddToRoadnet;
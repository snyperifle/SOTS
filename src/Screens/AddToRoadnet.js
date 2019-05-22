/* eslint-disable no-useless-concat */
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

class AddToRoadnet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      selectedOpcoType: null,
      routerNumbers: ['ROADNET01', 'ROADNET02', 'ROADNET03', 'ROADNET04', 'ROADNET05'],
      cleanupEmail: 'We have an ongoing cleanup activity for the Roadnet Environment. Please let me know who the new users are replacing.',
      noOpcoSelected: 'Please select an OpCo type',
      BLOptions: {
        type: `${this.props.userId ? this.props.userId + ":" : ""} US Broadline`,
        securityEmail: `Please add user ${this.props.userId ? this.props.userId : "XXXXXXX"} to the following DLs\n\n` + 'Roadnet Enterprise Users\n' + '000-212_Roadnet_users\n' + 'Citrix App - RI - Prod\n' + '000-Trans ERN-DL\n\n' + 'Once done, please assign to Roadnet',
        addedEmail:
          'Access to Roadnet Enterprise is provided for the below credentials. On successful login, you will be prompted to change your password.\n\n' + `User ID: ${this.props.userId ? this.props.userId : "XXXXXXX"}\n` + 'Password (all lowercase): sysco123\n\n' +
          'Access to the Routing Interface is provided for the below credentials.\n' + `User ID: ${this.props.selectedRouterNumber}\n` + 'Password (all lowercase): mrrobot8\n\n' + 'Please let me know if there are any issues.',
      },
      NonBLOptions: {
        type: `${this.props.userId ? this.props.userId + ":" : ""} FP, Meat, Canada`,
        securityEmail: `Please add user ${this.props.userId ? this.props.userId : "XXXXXXX"} to the following DLs\n\n` + 'Roadnet Enterprise Users\n' + '000-212_Roadnet_users\n' + '000-Trans ERN-DL\n\n' + 'Once done, please assign to Roadnet',
        addedEmail: 'Access to Roadnet Enterprise is provided for the below credentials. On successful login, you will be prompted to change your password.\n\n' + `User ID: ${this.props.userId ? this.props.userId : "XXXXXXX"}\n` + 'Password (all lowercase): sysco123',
      },
      MexicoOptions: {
        type: `${this.props.userId ? this.props.userId + ":" : ""} Mexico`,
        securityEmail: `Please add user ${this.props.userId ? this.props.userId : "XXXXXXX"} to the following DLs\n\n` + 'Roadnet Enterprise Mexico Users\n' + '000-212_Roadnet_users\n' + 'Citrix App - RI - Prod\n' + '000-Trans ERN-DL\n\n' + 'Once done, please assign to Roadnet',
        addedEmail: 'Access to Roadnet Enterprise is provided for the below credentials. On successful login, you will be prompted to change your password.\n\n' + `User ID: ${this.props.userId ? this.props.userId : "XXXXXXX"}\n` + 'Password (all lowercase): sysco123',
      },
    };
  }

  componentDidMount(){
    // if(this.props.userId === '') alert('Please Enter a User ID')
  }

  componentWillReceiveProps(prevProps, prevState) {
    if (prevProps.selectedRouterNumber !== this.props.selectedRouterNumber) {
      this.setState({ BLOptions: this.state.BLOptions })
    }
  }

  render() {
    return (
      <div style={{
        marginLeft: 20,
        marginTop: 20,
      }}>
        <h2>Add user to Roadnet instructions</h2>
        {/* //============================================================= */}
        <form autoComplete="off">
          <FormControl>
            <InputLabel >Select OpCo Type for {this.props.userId ? this.props.userId : 'User'}</InputLabel>
            <Select
              style={{ width: 250 }}
              value={this.state.selectedOpcoType || 'No Opco'}
              onChange={(event) => {
                this.setState({
                  selectedOpcoType: event.target.value
                })
              }}
            >
              <MenuItem value={this.state.BLOptions}>{this.state.BLOptions.type}</MenuItem>
              <MenuItem value={this.state.NonBLOptions}>{this.state.NonBLOptions.type}</MenuItem>
              <MenuItem value={this.state.MexicoOptions}>{this.state.MexicoOptions.type}</MenuItem>
            </Select>
          </FormControl>
        </form>
        {/* //============================================================= */}
        <ol
          style={{
            marginTop: 20,
          }}
        >
          {/* //============================================================= */}
          <li>
            <h3>Email this message to requester:</h3>
            <h4>{this.state.value}</h4>
            <CopyToClipboard
              text={this.state.cleanupEmail}>
              <button>Copy</button>
            </CopyToClipboard>
            {this.state.cleanupCopied === true ? <h4>Message Copied</h4> : null}
          </li>
          {/* //============================================================= */}
          <li>
            <h3>Go to <a href={'https://myoffice.sysco.com/Citrix/Internal/'}>MyOffice Sysco</a> => 'Roadnet Enterprise'</h3>
            <h3>Assign incident to 'Security Admin'</h3>
            <h3>Add this message into 'Work Notes'</h3>
            <CopyToClipboard
              text={this.state.selectedOpcoType ? this.state.selectedOpcoType.securityEmail : this.state.noOpcoSelected}>
              <button>Copy</button>
            </CopyToClipboard>
          </li>
          {/* //============================================================= */}
          <li>
            <h3>Go to <a href={'https://myoffice.sysco.com/Citrix/Internal/'}> Roadnet Enterprise</a></h3>
            <ul>
              <li>
                <h4>'Administration' => 'List' => 'Users' => 'Add'</h4>
              </li>
              <li>
                <h4>Fill out information in 'General' tab (password is sysco123)</h4>
              </li>
              <li>
                <h4>Check 'Require Password Change on Next Login'</h4>
              </li>
              <li>
                <h4>Set Time Zone</h4>
              </li>
              <li>
                <h4>Add 'User Group' in 'Membership' tab</h4>
              </li>
            </ul>
          </li>
          {/* //============================================================= */}
          {this.state.selectedOpcoType === this.state.BLOptions ?
            <li>
              <h3>Go to <a href={'10.242.140.84:3001/login'}>Roadnet Support Dashboard</a></h3>
              <h3>Select 'Add New RI User'</h3>
              <form autoComplete="off">
                <FormControl>
                  <InputLabel>Selected Router#</InputLabel>
                  <Select
                    style={{ width: 250 }}
                    value={this.props.selectedRouterNumber}
                    onChange={(event) => {
                      this.props.changeSelectedRouterNumber(event.target.value);
                      let temp = this.state.BLOptions;
                      temp.addedEmail = 'Access to Roadnet Enterprise is provided for the below credentials. On successful login, you will be prompted to change your password.\n\n' + `User ID: ${this.props.userId ? this.props.userId : "XXXXXXX"}\n` + 'Password (all lowercase): sysco123\n\n' +
                        'Access to the Routing Interface is provided for the below credentials.\n' + `User ID: ${event.target.value}\n` + 'Password (all lowercase): mrrobot8\n\n' + 'Please let me know if there are any issues.';
                      this.setState({ BLOptions: temp })
                    }}
                  >
                    {this.state.routerNumbers.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </form>
            </li>
            : null}
          {/* //============================================================= */}
          <li>
            <h3>Email this message to requester:</h3>
            <CopyToClipboard
              text={this.state.selectedOpcoType ? this.state.selectedOpcoType.addedEmail : this.state.noOpcoSelected}
            >
              <button>Copy</button>
            </CopyToClipboard>
          </li>
          {/* //============================================================= */}



          {/* //============================================================= */}
        </ol>
      </div >
    )
  }
}
export default AddToRoadnet;
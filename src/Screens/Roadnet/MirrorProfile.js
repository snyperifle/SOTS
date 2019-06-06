import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
//=============================================================
class MirrorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fromProfile: '',
      toProfile: '',
      copiedFiles: [],
    };
    this.mirrorProfile = this.mirrorProfile.bind(this);
  }
  //=============================================================
  mirrorProfile() {
    this.setState({
      copiedFiles: [],
    })
    
  }
  //=============================================================
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>
          Mirror Profile Configs
          </h2>

      </div>
    )
  }
}
export default MirrorProfile;
import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
//=============================================================
class RestoreColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restoredFiles: [],
    };
    this.restoreColumns = this.restoreColumns.bind(this);
  }
  //=============================================================
  restoreColumns() {
    axios.post('/restoreColumns',
      {
        data: this.props.userId
      })
      .then((response) => {
        this.setState({ restoredFiles: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  //=============================================================
  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Restoring User Column Settings</h2>
        {
          this.props.userId === '' ?
            <h2 style={{ color: 'red' }}>Please enter a User ID</h2>
            :
            <div>
              <h3>Restore column settings for {this.props.userId}?</h3>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.restoreColumns();
                }}
              >
                Confirm
          </Button>
            </div>
        }
        {
          this.state.restoredFiles ?
            <div>
              <h4>Files found and restored: </h4>
              <ul>
                {this.state.restoredFiles.map((item) => {
                  <li>{item}</li>
                })}
              </ul>
            </div> :
            null
        }
      </div>
    )
  }
}
export default RestoreColumns;
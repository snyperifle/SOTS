import React from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";
//=============================================================
import Button from '@material-ui/core/Button';
//=============================================================
class RemoveFromRI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
    };
    this.removeUser = this.removeUser.bind(this);
  }
  //=============================================================
  componentDidMount() {
  }

  removeUser() {
    let temp = this.props.file.filter((item) => (
      !item.split(' ')[0].includes(this.props.userId)
    ));
    if (temp.length !== this.props.file.length) {
      axios.post('/updateUserConfigs', {
        data: temp.join('\n')
      })
        .then((res) => {
          this.props.updateOpCo();
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      alert(`User: ${this.props.userId} does not exist in Routing Interface`)
    }
  }

  render() {
    if (this.props.file.length === 0) return <Redirect to='/' />
    return (
      <div
        style={{ margin: 20 }}
      >
        <h2>Remove {this.props.userId !== '' ? this.props.userId : 'user'} from Routing Interface{this.props.userId !== '' ? '?' : null}</h2>
        {this.props.userId === '' ?
          <h2 style={{ color: 'red' }}>Please enter a User ID</h2>
          :
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              this.removeUser();
            }}
          >
            Confirm
          </Button>
        }
      </div>
    )
  }
}
//=============================================================
export default RemoveFromRI;
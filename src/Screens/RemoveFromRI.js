import React from 'react';
import axios from 'axios';
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
    if (this.props.userId === '') alert('Please go back and enter User ID')
    axios.get('/getFiles')
      .then(res => {
        let data = res.data.split('\n')
        this.setState({
          file: data
        })
      })
  }

  removeUser() {
    let temp = this.state.file.filter((item) => (
      !item.split(' ')[0].includes(this.props.userId)
    ));
    if (temp.length !== this.state.file.length) {
      axios.post('/updateUserConfigs', {
        data: temp.join('\n')
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      alert(`User: ${this.props.userId} does not exist in Routing Interface`)
    }
  }

  render() {
    return (
      <div
        style={{ margin: 20 }}
      >
        <h2>Remove user {this.props.userId !== '' ? this.props.userId : 'null'} from Routing Interface?</h2>
        {this.props.userId === '' ?
          <h2>Please go back and enter User ID</h2>
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
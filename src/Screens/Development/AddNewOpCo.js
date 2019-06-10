import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
//=============================================================
class AddNewOpCo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OpCoNum: 0,
      OpCoName: '',
    };
    this.createOpCo = this.createOpCo.bind(this);
  }
  //=============================================================
  createOpCo() {
    alert('FIRING');
    axios.post('/createNewOpCo',
      {
        data: {
          OpCoNum: this.state.OpCoNum,
          OpCoName: this.state.OpCoName,
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }
  //=============================================================
  render() {
    return (
      <div>
        <Form inline >
          <FormControl
            type="text"
            placeholder="Enter the new OpCo Number"
            style={{ width: 350 }}
            onChange={(input) => {
              if (input.target.value.length) {
                this.setState({
                  OpCoNum: input.target.value
                })
              }
            }}
          />
          <FormControl
            type="text"
            placeholder="Enter the new OpCo Name"
            style={{ width: 350 }}
            onChange={(input) => {
              if (input.target.value.length) {
                this.setState({
                  OpCoName: input.target.value
                })
              }
            }}
          />
        </Form>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            this.createOpCo();
          }}
        >Create New OpCo</Button>
        <button
          onClick={() => console.log(this.state)}
        >test</button>
      </div>
    )
  }
}
export default AddNewOpCo;
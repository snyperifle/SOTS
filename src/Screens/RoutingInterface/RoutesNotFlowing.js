import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
//=============================================================
class RoutesNotFlowing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      routes: [],
      route: '',
      message: '',
      path: '',
    };
    this.getRoutes = this.getRoutes.bind(this);
  }

  getRoutes() {
    this.setState({
      loading: true,
      message: '',
      path: '',
    })
    axios.post('/routesNotFlowing', {
      data: {
        userOpCo: this.props.userOpCo,
        route: this.state.route
      }
    }).then((res) => {

      console.log(res.data)
      this.setState({
        message: res.data.result,
        path: res.data.path,
        loading: false
      })
    })
      .catch((err) => console.log(err))

  }

  render() {
    return (
      <div>
        <h2>Routes Not Flowing to SUS</h2>
        <h4>Enter a route number to search through RTRDL and RTRUL folders</h4>
        <Form
          style={{ width: 400, margin: 20 }}
        >
          <FormControl
            type="text"
            placeholder="Route Number, ex:1234"
            onChange={(text) => {
              if (text.target.value.length === 4) {
                this.setState({
                  route: text.target.value
                })
              }
            }}
          ></FormControl>
        </Form>
        {this.props.userOpCo ?
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.getRoutes()
            }}
          >Search route {this.state.route} for {this.props.userOpCo}</Button>
          :
          <h4
            style={{ color: 'red' }}
          >Please enter the Caller ID</h4>
        }
        {this.state.message.length > 0 ?
          <div style={{ margin: 20 }}>
            <h5>{this.state.message}</h5>
            <h5>{this.state.path}</h5>
          </div>
          : null
        }
        {
          this.state.loading === true ?
            <h3>Loading...</h3>
            : null
        }
      </div>
    )
  }
}
export default RoutesNotFlowing;
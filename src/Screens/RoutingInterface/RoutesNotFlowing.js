import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Row, Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import '../../App.css';
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
      enabled: true,
      date: '',
    };
    this.getRoutes = this.getRoutes.bind(this);
  }
  //=============================================================
  getRoutes() {
    this.setState({
      loading: true,
      message: '',
      path: '',
      date: '',
      enabled: false,
    })
    axios.post('/routesNotFlowing', {
      data: {
        userOpCo: this.props.userOpCo,
        route: this.state.route
      }
    }).then((res) => {
      this.setState({
        message: res.data.result,
        path: res.data.path,
        date: res.data.date,
        loading: false,
        enabled: true,
      })
    })
      .catch((err) => {
        console.log(err)
        this.setState({
          enabled: true
        })
      })
  }
  //=============================================================
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Routes Not Flowing to SUS</h2>
          </Col>
        </Row>
        <Row>
          <Col>
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
            {this.props.userOpCo && this.state.enabled ?
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.getRoutes()
                }}
              >Search for route {this.state.route} in {this.props.userOpCo}</Button>
              :
              this.state.enabled === false ? 
              <h4>Please hold</h4>
              :
              <h4
                style={{ color: 'red' }}
              >Please enter the Caller ID</h4>
            }
          </Col>
          <Col>
            {this.state.message.length > 0 ?
              <div style={{ margin: 20 }}>
                <h5>{this.state.message}</h5>
                <h5>{this.state.path}</h5>
                <h5>Last modified: {this.state.date.slice(0,10)}</h5>
              </div>
              : null
            }
            {
              this.state.loading === true ?
                <PulseLoader />
                : null
            }
          </Col>
        </Row>
      </Container>
    )
  }
}
export default RoutesNotFlowing;
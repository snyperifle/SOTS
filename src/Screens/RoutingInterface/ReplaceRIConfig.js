import React from 'react';
import axios from 'axios';
//=============================================================
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { PulseLoader } from 'react-spinners';
//=============================================================
class ReplaceRIConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.replaceConfig = this.replaceConfig.bind(this);
  }
  //=============================================================
  replaceConfig() {
    axios.post('/replaceRIConfig',
    {
    data: this.props.userOpCo
    })
    .then( (response) => {
    console.log(response.data);
    })
    .catch( (error) => {
    console.log(error);
    })
  }
  //=============================================================
  render() {
    return (
      <Container className="MainPage">
        <Row className="Title">
          <Col>
            {
              this.props.userOpCo ?
                <div>
                  <h2>Replace RI Config for {this.props.userId}?</h2>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      this.replaceConfig();
                    }}
                  >Confirm</Button>
                </div>
                :
                <div>
                  <h2>Replace RI Config File</h2>
                  <h2 style={{ color: 'red' }}>Please enter the Caller ID</h2>
                </div>
            }
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default ReplaceRIConfig;
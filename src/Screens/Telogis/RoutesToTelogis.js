import React from 'react';
import axios from 'axios';
//=============================================================
import { Container, Row, Col } from 'react-bootstrap';
import '../../App.css';
import { PulseLoader } from 'react-spinners';
//=============================================================
class RoutesToTelogis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  //=============================================================
  componentDidMount() {

  }
  //=============================================================

  //=============================================================
  render() {
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <h2>Routes Not Flowing to Telogis</h2>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default RoutesToTelogis;
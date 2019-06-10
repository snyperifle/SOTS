import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import { CSVLink } from "react-csv";
import { Container, Row, Col } from 'react-bootstrap';
//=============================================================
class GS1Barcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.connectToGS1DB = this.connectToGS1DB.bind(this);
    this.disconnectedFromGS1DB = this.disconnectedFromGS1DB.bind(this);
  }

  componentDidMount() {

    // this.connectToGS1DB();
  }
  componentWillUnmount() {

    // this.disconnectedFromGS1DB();
  }
  connectToGS1DB() {
    axios.get('/connectToGS1DB', {})
      .then((response) => {
        console.log(response.data);;
      })
      .catch((error) => {
        console.log(error);
      })
  }
  disconnectedFromGS1DB() {
    axios.get('/disconnectFromGS1DB', {})
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
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <h2>GS1 Barcode</h2>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <h4>Manually Process?</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {

              }}
            >Process</Button>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    )
  }
}
export default GS1Barcode;
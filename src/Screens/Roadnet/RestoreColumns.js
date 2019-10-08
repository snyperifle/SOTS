import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import '../../App.css'
//=============================================================
class RestoreColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      restoredFiles: [],
    };
    this.restoreColumns = this.restoreColumns.bind(this);
  }
  //=============================================================
  restoreColumns() {
    this.setState({
      loading: true,
      restoredFiles: []
    })
    axios.post('/restoreColumns',
      {
        data: this.props.userId
      })
      .then((response) => {
        console.log(response.data)
        this.setState({ restoredFiles: response.data, loading: false })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  //=============================================================
  render() {
    return (
      <Container className="MainPage">
        <Row className="Title">
          <Col>
            <h2>Restoring User Column Settings</h2>
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
          <Col>
            {
              this.state.restoredFiles.length > 0 ?
                <div>
                  <h4>Files restored:</h4>
                  <ul>
                    {this.state.restoredFiles.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ul>
                </div> :
                null
            }
            {
              this.state.loading === true ? 
              <PulseLoader/>
              : null
            }
          </Col>
        </Row>
      </Container>
    )
  }
}
export default RestoreColumns;
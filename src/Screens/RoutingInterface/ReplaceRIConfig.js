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
      loading: false,
      filesReplaced: [],
    };
    this.replaceConfig = this.replaceConfig.bind(this);
  }
  //=============================================================
  replaceConfig() {
    this.setState({
      loading: true,
      filesReplaced: [],
    })
    axios.post('/replaceRIConfig',
      {
        data: {
          OpCo: this.props.userOpCo,
          name: this.props.allOpCo.filter((item) => item.num === this.props.userOpCo.substring(0, 3))
        }
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          filesReplaced: response.data,
          loading: false,
        })
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
          <Col>
            {this.state.filesReplaced.length > 0 ?
              <div>
                <h5>Files replaced: </h5>
                <ul>
                  {this.state.filesReplaced.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
              : null
            }
            {this.state.loading === true ? <PulseLoader /> : null}
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
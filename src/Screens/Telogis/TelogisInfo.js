import React from 'react';
//=============================================================
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from '@material-ui/core'
import '../../App.css';
//=============================================================
class TelogisInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'For Telogis help, please reach out to "Verizon Connect Support".\nEmail: Support@srv.verizonconnect.com OR syscosupport@telogis.com\n24/7 Phone: (866)884-8538\n',
      copied: false,
    };
  }
  //=============================================================
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Telogis Information</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Email this message to Caller</h5>
            <Row>
              <CopyToClipboard
                text={this.state.message}
                style={{ marginLeft: 15 }}
              >
                {/* <button
                  onClick={() => {
                    this.setState({ copied: true })
                  }}
                >Copy</button> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({ copied: true })
                  }}
                >Copy</Button>
              </CopyToClipboard>
              {this.state.copied === true ?
                <h6 style={{ marginLeft: 10 }}>Copied to Clipboard</h6>
                : null}
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}
//=============================================================
export default TelogisInfo;
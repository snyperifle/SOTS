import React from 'react';
import axios from 'axios';
//=============================================================
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { PulseLoader } from 'react-spinners';
//=============================================================
class GenerateRiConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      filesGenerated: [],
      missingFiles: [],
    };
    this.generateConfigFiles = this.generateConfigFiles.bind(this);
  }
  //=============================================================
  generateConfigFiles() {
    this.setState({
      loading: true,
      filesGenerated: [],
      missingFiles: [],
    })
    axios.post('/generateConfigFiles',
      {
        data: {
          // OpCo: this.props.userOpCo,
          // name: this.props.allOpCo.filter((item) => item.num === this.props.userOpCo.substring(0, 3))
        }
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          filesGenerated: response.data.filesGenerated,
          missingFiles: response.data.missingFiles,
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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.generateConfigFiles();
              }}
            >
              Generate Config Files
            </Button>
          </Col>
          <Col>
            {this.state.filesGenerated.length > 0 ?
              <div>
                <h5>Files Replaced: </h5>
                <ul>
                  {this.state.filesGenerated.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
              : null
            }
            {this.state.missingFiles.length > 0 ?
              <div>
                <h5>Missing Files:  </h5>
                <ul>
                  {this.state.missingFiles.map((item) => (
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
export default GenerateRiConfig;
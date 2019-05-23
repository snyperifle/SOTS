import React from 'react';
import axios from 'axios';
//=============================================================
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//=============================================================
class AddToRI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOpCo: '',
      selectedOpCoRouters: [],
      routerNumbers: ['ROADNET01', 'ROADNET02', 'ROADNET03', 'ROADNET04', 'ROADNET05'],
      selectedRouterNumber: null,
      file: [],
    };
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    axios.get('/getFiles')
      .then(res => {
        let data = res.data.split('\n')
        this.setState({
          file: data
        })
      })
  }

  addUser() {
    let temp = this.state.file;
    temp.push(`${this.props.userId} ${this.state.selectedOpCo.num}-${this.state.selectedRouterNumber.substring(8)}`)
    this.setState({
      file: temp,
      selectedOpCoRouters: this.state.file.filter((item) => item.split(' ')[1].includes(String(this.state.selectedOpCo.num)))
    })
    axios.post('/updateUserConfigs', {
      data: temp.join("\n")
    })
      .then((response) => {
        console.log(response.data);
        this.props.updateOpCo();
      })
      .catch((error) => {
        console.log(error);
      })


    // alert(`${this.props.userId} added to ${this.state.selectedOpCo.name} as ${this.state.selectedRouterNumber}`)
  }
  render() {
    return (
      <div
        style={{ margin: 20 }}
      >
        <h2>Add {this.props.userId ? this.props.userId : 'user'} to Routing Interface</h2>
        {this.props.userId === '' ? <h2 style={{ color: 'red' }}>Please enter a User ID</h2> : null}
        {/* //============================================================= */}
        <form
          autoComplete="off"
          style={{ marginBottom: 5 }}
        >
          <FormControl>
            <InputLabel >Select OpCo</InputLabel>
            <Select
              style={{ width: 250 }}
              value={this.state.selectedOpCo || "No Opco Selected"}
              onChange={(event) => {
                this.setState({
                  selectedOpCo: event.target.value,
                  selectedOpCoRouters: this.state.file.filter((item) => item.split(' ')[1].includes(String(event.target.value.num)))
                })
              }}
            >
              {this.props.allOpCo.map((item, i) => (
                <MenuItem key={item.num} value={item}>{item.num} - {item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
        {/* //============================================================= */}
        <form
          autoComplete="off"
          style={{ marginBottom: 5 }}
        >
          <FormControl>
            <InputLabel >Select Router Number</InputLabel>
            <Select
              style={{ width: 250 }}
              value={this.state.selectedRouterNumber || "No Device Type Selected"}
              onChange={(event) => {
                this.setState({
                  selectedRouterNumber: event.target.value
                })
              }}
            >
              {this.state.routerNumbers.map((item, i) => (
                <MenuItem key={item[i]} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
        {/* //============================================================= */}
        {this.state.selectedOpCo !== '' ?
          <div>
            <h3>Current routers from {this.state.selectedOpCo.name}</h3>
            <ul>
              {this.state.selectedOpCoRouters.map((item, i) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          : null
        }
        {this.props.userId !== '' && this.state.selectedOpCo !== '' && this.state.selectedRouterNumber !== null ?
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (this.props.userId !== '' && this.state.selectedOpCo !== '' && this.state.selectedRouterNumber !== null) {
                this.addUser();
              }
            }}
          >
            Add User
        </Button>
          : null}
        {/* //============================================================= */}
      </div>
    )
  }
}
export default AddToRI;
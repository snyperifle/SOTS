import React from 'react';
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//=============================================================
class AddToGasboy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceType: [
        { type: "Tractor / Trailer" },
        { type: "Driver / Employee" }
      ],
      selectedOpCo: '',
      selectedDeviceType: null,
      trailerName: "",
      employeeName: "",
      number: "",
      queue: [],
    };
  }
  componentDidMount() {
  }
  render() {
    return (
      <div
        style={{ alignSelf: 'center' }}
      >
        <h2>Gasboy Interface</h2>
        {/* //============================================================= */}
        <form
          autoComplete="off"
          style={{ marginBottom: 5 }}
        >
          <FormControl>
            <InputLabel >Select OpCo</InputLabel>
            <Select
              style={{ width: 250 }}
              value={this.state.selectedOpco || "No Opco Selected"}
              onChange={(event) => {
                this.setState({
                  selectedOpco: event.target.value
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
            {this.state.selectedOpCo ? null : <InputLabel >Select Device Type</InputLabel>}
            <Select
              style={{ width: 250 }}
              value={this.state.selectedDeviceType || "No Device Type Selected"}
              onChange={(event) => {
                this.setState({
                  selectedDeviceType: event.target.value
                })
              }}
            >
              {this.state.deviceType.map((item, i) => (
                <MenuItem key={item.type} value={item}>{item.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
        {/* //============================================================= */}
        {this.state.selectedDeviceType === this.state.deviceType[1] ?
          <form>
            <TextField
              label="Employee Name"
              required
              value={this.state.employeeName}
              onChange={(event) => {
                this.setState({ employeeName: event.target.value })
              }}
            />
          </form>
          : null
        }
        {/* //============================================================= */}
        {this.state.selectedDeviceType ?
          <form>
            <TextField
              label="ID"
              required
              value={this.state.number}
              onChange={(event) => {
                this.setState({ number: event.target.value })
              }}
              style={{ marginBottom: 10 }}
            />
          </form> : null}
        {/* //============================================================= */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            let temp = this.state.queue;
            if (this.state.employeeName && this.state.number) {
              temp.push(`${this.state.employeeName},${this.state.number}`)
              this.setState({ 
                queue: temp ,
                employeeName: '',
                number: '',
              })
            } else if (!this.state.employeeName && this.state.number) {
              temp.push(`${this.state.number}`) 
              this.setState({ 
                queue: temp,
                number:'',
              })
            }
            else {
              console.log("Require input")
            }
          }}
        >Add</Button>
        {/* //============================================================= */}
        {this.state.queue.length ?
          <ul>
            {this.state.queue.map((item, i) => (
              <li key={item[i]}>{item}</li>
            ))}
          </ul>
          : null}
        {/* //============================================================= */}
        {this.state.queue.length ? <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            this.setState({
              queue:[]
            })
            console.log(`Submitting ${this.state.queue}`);
          }}
        >Create Excel file</Button> : null}
        {/* //============================================================= */}
      </div>
    )
  }
}
export default AddToGasboy;
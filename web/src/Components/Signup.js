import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import instance from "../AjaxCrtl.js"

class Signup extends React.Component {
  
  constructor(){
    super();
    this.state = {
      email     : '',
      firstName : '',
      lastName  : '',
      pass      : '',
      pass2     : '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e){
    e.preventDefault();
    instance().post('signup', {
      firstName   : this.state.firstName,
      lastName    : this.state.lastName,
      email       : this.state.email,
      password    : this.state.pass
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  render(){
    return (
      <Dialog
        open
        fullScreen={this.props.fullScreen}>
        <form onSubmit={this.handleSubmit}>
        <DialogTitle>Signup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your info in order to start creating contests.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            value={this.state.email}
            onChange={(e) => this.setState({email: e.target.value})}
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="firstname"
            label="First name"
            type="text"
            value={this.state.firstName}
            onChange={(e) => this.setState({firstName: e.target.value})}
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="lastname"
            label="Last name"
            type="text"
            value={this.state.lastName}
            onChange={(e) => this.setState({lastName: e.target.value})}
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="pass"
            label="password"
            type="password"
            value={this.state.pass}
            onChange={(e) => this.setState({pass: e.target.value})}
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="passconf"
            label="Confirm password"
            type="password"
            value={this.state.pass2}
            onChange={(e) => this.setState({pass2: e.target.value})}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggleSignup} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Send
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default Signup;
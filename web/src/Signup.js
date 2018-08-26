import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import axios from 'axios';

class Signup extends React.Component {
  
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e){
    e.preventDefault();
    axios.get('call/some/endpoint')
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
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="firstname"
            label="First name"
            type="text"
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="lastname"
            label="Last name"
            type="text"
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="pass"
            label="password"
            type="password"
            required
            fullWidth
          />
          <TextField
            margin="dense"
            id="passconf"
            label="Confirm password"
            type="password"
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
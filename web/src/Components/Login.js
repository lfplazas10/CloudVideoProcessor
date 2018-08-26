import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import axios from 'axios';

class Login extends React.Component {
  
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e){
   e.preventDefault();
  //Check Signup.js
  }
  
  render(){
    return (
      <Dialog
        open
        fullScreen={this.props.fullScreen}>
        <form onSubmit={this.handleSubmit}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Login into your account
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
            id="pass"
            label="password"
            type="password"
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggleLogin} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Login
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default Login;
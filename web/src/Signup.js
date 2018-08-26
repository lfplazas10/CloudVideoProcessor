import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";


class Signup extends React.Component {
  
  constructor(){
    super();
  }
  
  
  render(){
    return (
      <Dialog
        open
        fullScreen={this.props.fullScreen}>
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
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="firstname"
            label="First name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="lastname"
            label="Last name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="pass"
            label="password"
            type="password"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="passconf"
            label="Confirm password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggleSignup} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.toggleSignup} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default Signup;
import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import instance from "../../Helpers/AjaxCrtl.js"
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';

class Signup extends React.Component {

  constructor() {
    super();
    this.state = {
      open: true,
      error: null,
      email: '',
      firstName: '',
      lastName: '',
      pass: '',
      pass2: '',
      loading: false
    };
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.showInputError   = this.showInputError.bind(this);
    this.showMessage      = this.showMessage.bind(this);
  }
  
  showInputError(message){
    return (
      <Dialog
        open={true}
        onClose={this.setState({errorMessage: null})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error: "+message}</DialogTitle>
        <DialogActions>
          <DialogActions>
            <Button onClick={() => this.setState({errorMessage: null})} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>
    );
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if(this.state.pass != this.state.pass2) {
      this.setState({errorMessage: this.showInputError("Passwords don't match")});
      return;
    }
    if (!this.state.loading) {
      this.setState({
        success: false,
        loading: true,
      }, () => {
        instance().post('signup', {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.pass
        })
          .then((response) => {
            this.setState({ success: true, loading: false, open: false });
            console.log(response);
          })
          .catch((error) => {
            console.log(error.response)
            this.setState({ success: false, loading: false, error: error.response.data });
          });
      },
      );
    }
  }

  showMessage() {
    if (this.state.success && !this.state.loading)
      return (
        <Dialog
          open={this.state.success && !this.state.loading}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Your account was created! You can now login."}</DialogTitle>
          <DialogActions>
            <Button onClick={() => this.props.toggleSignup(true)} color="primary" autoFocus>
              Login
            </Button>
          </DialogActions>
        </Dialog>
      )
    else if (this.state.error != null && !this.state.loading)
      return (
        <Dialog
          open={this.state.error != null && !this.state.loading}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Error: " + this.state.error.error}</DialogTitle>
          <DialogActions>
            <Button onClick={() => { this.setState({ error: null }) }} color="primary" autoFocus>
              Try again
            </Button>
          </DialogActions>
        </Dialog>
      )
  }

  render() {
    const { loading, success } = this.state;
    const { classes } = this.props;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });
    return (
      <div>
        <Dialog
          open={this.state.open}
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
                onChange={(e) => this.setState({ email: e.target.value })}
                required
                fullWidth
              />
              <TextField
                margin="dense"
                id="firstname"
                label="First name"
                type="text"
                value={this.state.firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
                required
                fullWidth
              />
              <TextField
                margin="dense"
                id="lastname"
                label="Last name"
                type="text"
                value={this.state.lastName}
                onChange={(e) => this.setState({ lastName: e.target.value })}
                required
                fullWidth
              />
              <TextField
                margin="dense"
                id="pass"
                label="password"
                type="password"
                value={this.state.pass}
                onChange={(e) => this.setState({ pass: e.target.value })}
                required
                fullWidth
              />
              <TextField
                margin="dense"
                id="passconf"
                label="Confirm password"
                type="password"
                value={this.state.pass2}
                onChange={(e) => this.setState({ pass2: e.target.value })}
                required
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.toggleSignup} color="primary">
                Cancel
            </Button>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={buttonClassname}
                  disabled={loading}
                  type="submit"
                  onClick={this.handleButtonClick}
                >
                  Send
              </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </DialogActions>
          </form>
        </Dialog>
        {this.showMessage()}
        {this.state.errorMessage}
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export default withStyles(styles)(Signup);
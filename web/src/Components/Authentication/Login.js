import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import PropTypes from "prop-types";
import instance from "../../Helpers/AjaxCrtl.js"
import browserHistory from "../../Helpers/BrowserHistory.js"

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      pass: '',
      success: false,
      loading: false,
      logged: false,
      open: true,
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.loading) {
      this.setState({
        success: false,
        loading: true,
      }, () => {
        instance().post('login', {
          email: this.state.email,
          password: this.state.pass
        })
          .then((response) => {
            this.setState({ success: true, loading: false, open: false, logged: true });
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
    if (this.state.logged && !this.state.loading)
      return (
        <Dialog
          open={this.state.success && !this.state.loading}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Login successful."}</DialogTitle>
          <DialogActions>
            <Button onClick={() => browserHistory.push("/contests")} color="primary" autoFocus>
              Continue
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
    return (
      <div>
        <Dialog
          open={this.state.open}
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
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
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
        {this.showMessage()}
      </div>
    )
  }
}

export default Login;
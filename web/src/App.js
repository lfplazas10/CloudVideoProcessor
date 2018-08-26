import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import './App.css';
import Signup from "./Signup.js";
import Login from "./Login";

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class App extends Component {
  
  constructor(){
    super();
    this.state = {
      signup    : false,
      login     : false,
    };
    this.toggleSignup = this.toggleSignup.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
  }
  
  toggleSignup(){
    this.setState({signup : !this.state.signup})
  }
  
  toggleLogin(){
    this.setState({login : !this.state.login})
  }
  render() {
    return (
      <div className="main">
  
        <AppBar position="static">
          <Toolbar>
            <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={this.props.classes.flex}>
              Content Manager
            </Typography>
            <Button color="inherit" onClick={this.toggleSignup}>
              Signup
            </Button>
            <Button color="inherit" onClick={this.toggleLogin}>
              Login
            </Button>
          </Toolbar>
        </AppBar>
        {this.state.signup && <Signup toggleSignup={this.toggleSignup}/>}
        {this.state.login && <Login toggleLogin={this.toggleLogin}/>}

      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

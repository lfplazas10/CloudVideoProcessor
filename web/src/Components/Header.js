import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/icons/Menu";
import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import authManager from "../Helpers/UserManagement.js"
import { Link } from 'react-router-dom'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      signup    : false,
      login     : false,
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
  }
  
  handleDrawerToggle() {
    this.setState({mobileOpen: !this.state.mobileOpen});
  }
  
  toggleSignup(login){
    this.setState({
      signup  : !this.state.signup,
      login   : login === true ? true : this.state.login
    });
  }
  
  toggleLogin(){
    this.setState({login : !this.state.login})
  }
  
  render() {
    const {
      classes
    } = this.props;
    
    return (
      <AppBar style={{opacity: 0.8} }>
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            <Typography variant="display1" color="inherit" className={this.props.classes.flex}>
              <Link to={this.props.isLogged? '/contests':'/'} className="mainKind">
                Smart Tools
              </Link>
            </Typography>
          </div>
          <Hidden smDown implementation="css">
            {!this.props.isLogged &&
            <Button  color="inherit" onClick={() => this.toggleSignup(false)}>
              Signup
            </Button>
            }
            {!this.props.isLogged &&
            <Button color="inherit" onClick={this.toggleLogin}>
              Login
            </Button>
            }
            {this.props.isLogged &&
            <Button color="inherit" onClick={() => authManager.logout()}>
              Logout
            </Button>
            }
          </Hidden>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              <Menu/>
            </IconButton>
          </Hidden>
        </Toolbar>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"right"}
            open={this.state.mobileOpen}
            classes={{
              paper: classes.drawerPaper
            }}
            onClose={this.handleDrawerToggle}
          >
            <div className={classes.appResponsive}>
              {!this.props.isLogged &&
              <Button color="inherit" onClick={() => this.toggleSignup(false)}>
                Signup
                </Button>
              }
              {!this.props.isLogged &&
              < Button color="inherit" onClick={this.toggleLogin}>
                Login
              </Button>
              }
              {this.props.isLogged &&
              < Button color="inherit" onClick={() => authManager.logout()}>
                Logout
              </Button>
              }
              
            </div>
          </Drawer>
        </Hidden>
        {this.state.signup && <Signup {...this.props} toggleSignup={this.toggleSignup}/>}
        {this.state.login && <Login toggleLogin={this.toggleLogin}/>}
      </AppBar>
    );
  }
}

export default (Header);

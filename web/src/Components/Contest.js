import React, { Component } from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Header from "./Header";
import ContestTable from "./ContestTable";

class Contest extends Component {

    constructor(props){
        super(props);
        this.state = {
            signup    : false,
            login     : false,
            id : 0
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
        const props = this.props;
        return (
            <div className="main">
                <MuiThemeProvider theme={THEME}>
                    <Header
                        {...props}
                        brand={'Content manager'}
                        color={'info'}/>
                    <ContestTable
                        {...props}
                        brand={'Content manager'}
                    />
                </MuiThemeProvider>
            </div>
        );
    }
}

const THEME = createMuiTheme({
    typography: {
        "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 18,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    }
});

const styles = {
    root: {
        flexGrow: 1,
    },
    table: {
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

Contest.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Contest);
import React, { Component } from 'react';
import Paper from "@material-ui/core/Paper/Paper";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit *7,
        paddingBottom: theme.spacing.unit *7,
    },
});

class Home extends  Component{

    constructor(props){
        super(props);
    }

    render(){
        const {
            classes
        } = this.props;
        return(
        <Paper className={classes.root} style={{marginTop: '35px'}}>
            <Typography variant="headline" component="h3">
                Welcome to Smart tools
            </Typography>
            <Typography component="p">
                You can create your own contests
            </Typography>

        </Paper>
        )
    }

}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default  withStyles(styles)(Home);
import React, { Component } from 'react';
import Paper from "@material-ui/core/Paper/Paper";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/es/Grid/Grid";

class Home extends  Component{

    render(){
        const {
            classes
        } = this.props;

        const features = [
            {
                img:'assets/contest.jpg',
                name: 'Create video contests',
                desc: 'Increase your number of users by creating contests',
            },
            {
                img: 'assets/custom.jpg',
                name: 'Easy and customizable',
                desc: 'Create a contest in less than two steps, with the image and public url you want',
            },
            {
                img: 'assets/video2.jpg',
                name: 'Multiple video formats supported',
                desc: 'We support several video formats for the convenience of users',
            },

        ];
        return(
            <div>

                <Grid container className={classes.root} spacing={24}>
                    <Grid item xs={12} sm={8}>
                        <Paper className={classes.root} >
                            <Typography variant="display3" gutterBottom>
                                <strong>Welcome to Smart tools</strong>
                            </Typography>
                            <Typography variant="display1" gutterBottom>
                                Create your own personalized video contests to increase your users and your commitment to your company
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid  item xs={12} sm={4}>
                        <img  className={classes.imgBanner} src="assets/idea.jpg" alt="idea"/>
                    </Grid>

                    {features.map(feature =>(
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.paper} elevation={1}>
                                <div >
                                    <img className={classes.img} src={feature.img} alt="custom"/>
                                </div>
                                <Typography variant="display2" gutterBottom>
                                    <strong>{feature.name}</strong>
                                </Typography>
                                <Typography variant="display1" gutterBottom>
                                    {feature.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </div>

        )
    }

}

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit *7,
        paddingBottom: theme.spacing.unit *7,
        height:'100%',
        width:'100%'
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 7,
        paddingBottom: theme.spacing.unit * 7,
        height: '100%',
        textAlign: 'center'
    },
    imgBanner: {
        width: 400,
        height: 420,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 2

    },
    img: {
        width:'100%',
        height: '100%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: theme.spacing.unit * 7
    },
    button: {
        padding:theme.spacing.unit * 3
    },
    buttonDiv:{
        paddingTop:theme.spacing.unit *5,
        textAlign:'center'

    }
});

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default  withStyles(styles)(Home);
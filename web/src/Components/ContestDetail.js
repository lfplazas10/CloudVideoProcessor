import React, { Component } from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import instance from "../AjaxCrtl";
import Header from "./Header";
import Grid from "@material-ui/core/es/Grid/Grid";
import Player from "./Player";


class ContestDetail extends Component {

    constructor(props){
        super(props);
        this.state={
            id: this.props.history.location.pathname.split('/')[this.props.history.location.pathname.split('/').length-1],
            submissions:[],
            playVideo: false,
            sources:''
        }
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){

        instance().get('contest/'+this.props.match.params.contestId+'/submissions')
            .then((response) => {
                this.setState({submissions:response.data});
            })
            .catch((error) => {
                console.log(error.response)
            });
    }

    togglePlayer(videoId){

/*        instance().get('contest/'+this.props.match.params.contestId+'/video/'+videoId)
            .then((response) => {
                this.setState({sources:'{"type": "video/flv", "src":"' + response.data.videoId + '"}'});
            })
            .catch((error) => {
                console.log(error.response)
            });*/
        this.setState({sources:'{"type": "video/mp4", "src": "/Westworld.S01E02.mkv"}'});


        this.setState({playVideo: !this.state.playVideo})
        console.log('haloo',this.state.sources,this.state.playVideo)
    }


    render() {
        const { classes } = this.props;
        const props = this.props;
        const contestId = props.match.params.contestId;
        return (
            <div className="main" style={{ marginTop: '75px' }} >
                <MuiThemeProvider theme={THEME}>
                    <Header
                        {...props}
                        brand={'Content manager'}
                        color={'info'}/>
                    { this.state.submissions ? (
                        <div>
                            {/*<TextField style={{padding: 24}}
                                           id="searchInput"
                                           placeholder="Search for Submissions"
                                           margin="normal"
                                />*/}
{/*
                            <Player sources='{"type": "video/mp4", "src":  "/Westworld.S01E02.mkv"}'/>
*/}

                            <Grid container spacing={24} style={{padding: 24}}>
                                { this.state.submissions.map(submission => (
                                    <Grid item xs={12} sm={4} md={3} xl={3}>
                                        <Card style={{padding: 10}} key={submission.id} >
                                            <CardMedia
                                                className={classes.media}
                                                image="/images.jpeg"
                                                title="video"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="headline" component="h2">
                                                    {submission.firstName} {submission.lastName}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Email: </strong>{submission.email}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Fecha:</strong> {submission.date}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Estado:</strong> {submission.state}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary"  onClick={() => this.togglePlayer(submission.videoId)}>
                                                    Ver original
                                                </Button>
                                                <Button size="small" color="primary">
                                                    Ver video convertido
                                                </Button>
                                            </CardActions>
                                        </Card>
                                        {submission.videoId != null &&
                                        <video width="140" height="100" controls>
                                            <source
                                                type={submission.videoType}
                                                src={'/api/'+contestId+'/video/'+submission.videoId}/>
                                            Your browser does not support the video tag.
                                        </video>
                                        }

                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    ) : "No courses found" }



                    {(this.state.playVideo && this.state.sources!=='')&& <Player sources={this.state.sources} togglePlayer={this.togglePlayer}/>}




                </MuiThemeProvider>
            </div>
        );
    }
}


const styles = {

    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        //justifyContent: 'space-around',
        overflow: 'hidden',
        padding: 50,
        height: 'auto',
    }
};

const THEME = createMuiTheme({
    typography: {
        "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 18,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    }
});


ContestDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContestDetail);

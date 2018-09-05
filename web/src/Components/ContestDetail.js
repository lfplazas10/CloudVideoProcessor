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
import {Pager} from "react-bootstrap";


class ContestDetail extends Component {

    constructor(props){
        super(props);
        this.state={
            id: this.props.history.location.pathname.split('/')[this.props.history.location.pathname.split('/').length-1],
            submissions:[],
            playVideo: false,
            sources:'',
            videoSrc:'',
            videoType:'',
            prevButton: false,
            nextButton: false,
            pageNum: 1
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.togglePlayer = this.togglePlayer.bind(this);
        this.getData = this.getData.bind(this);
        this.downPage = this.downPage.bind(this);
        this.upPage=this.upPage.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    getData(e){
        if (e && e.preventDefault) e.preventDefault();

        instance().get('contest/'+this.props.match.params.contestId+'/submissions/'+this.state.pageNum)
            .then((response) => {
                this.setState({submissions:response.data});
            })
            .catch((error) => {
                console.log(error.response)
            });

        instance().get('contest/'+this.props.match.params.contestId+'/submissions/'+this.state.pageNum+1)
            .then((response) => {
                //SI la siguiente página tiene videos mostrar boton de next
                if(response.data.length !== 0){
                    console.log('vacioo');
                    this.setState({nextButton:true})
                }
                console.log('responsedata',response.data)
            })
            .catch((error) => {
                console.log(error.response)
            });

    }

    togglePlayer(){
        this.setState({playVideo: !this.state.playVideo})
    }

    playVideo(videoType,videoId, converted){
        const contestId = this.props.match.params.contestId;

        //Distinguir url entre original y procesado
        if(converted && !videoId.endsWith('.mp4') ){
            videoId = videoId.slice(0, videoId.indexOf('.')) + '.mp4';
            console.log('new video', videoId);
        }

        this.setState({sources:'{"type": "'+videoType+'", "src":"'+videoId+'"}'});
        this.setState({videoSrc:'/api/'+contestId+'/video/'+videoId,videoType:videoType});

        this.togglePlayer();
    }

    formatDate(date) {

        let d = new Date(date);
        let day = d.getDate();
        let monthIndex = d.getMonth();
        let month = monthIndex < 8 ? "0" + (monthIndex + 1) : monthIndex + 1;
        let year = d.getFullYear();

        return year + "-" + month + "-" + day;
    }
    upPage(e) {
        e.preventDefault();
        const newPage = this.state.pageNum + 1;
        this.setState({ prevButton: true });
        this.setState({ pageNum: newPage }, this.getData);
    }

    downPage(e) {
        e.preventDefault();
        if (this.state.pageNum !== 1) {
            const newPage = this.state.pageNum - 1;
            this.setState({ pageNum: newPage }, this.getData)
        }
        else if(this.state.pageNum == 2)
            this.setState({ prevButton: false});
    }

    render() {
        const { classes } = this.props;
        const props = this.props;
        return (
            <div className="main" style={{ marginTop: '75px' }} >
                <MuiThemeProvider theme={THEME}>
                    <Header
                        {...props}
                        brand={'Content manager'}
                        color={'info'}/>
                    <Pager>
                        {this.state.prevButton &&  <Pager.Item onClick={this.downPage} previous > &larr; Previous Page </Pager.Item>}
                        {this.state.nextButton && <Pager.Item  onClick={this.upPage} next> Next Page &rarr; </Pager.Item>}
                    </Pager>

                    { this.state.submissions ? (
                        <div>
                            {/*<TextField style={{padding: 24}}
                                           id="searchInput"
                                           placeholder="Search for Submissions"
                                           margin="normal"
                                />*/}

{/*
                            <Player sources='{"type": "video/avi", "src":  "http://video-js.zencoder.com/oceans-clip.avi"}'/>
*/}

                            <Grid container spacing={24} style={{padding: 24}}>
                                { this.state.submissions.map(submission => (
                                    <Grid key={submission.id} item xs={12} sm={4} md={3} xl={3}>
                                        <Card style={{padding: 10}}  >
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
                                                    <strong>Fecha:</strong> {this.formatDate(submission.creationDate)}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Estado:</strong> {submission.state}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary"  onClick={() => this.playVideo(submission.videoType,submission.videoId,false)}>
                                                    Ver original
                                                </Button>
                                                {console.log('subm state',submission.state)}
                                                    <Button size="small" color="primary" disabled={submission.state=='Waiting'} onClick={() => this.playVideo(submission.videoType, submission.videoId,true)}>
                                                        Ver video convertido
                                                    </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    ) : "No courses found" }

                    {(this.state.playVideo && this.state.sources!=='')&& <Player videoType={this.state.videoType} videoSrc={this.state.videoSrc} sources={this.state.sources} togglePlayer={this.togglePlayer}/>}

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
    },
    flex: {
        flexGrow: 1,
    },
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

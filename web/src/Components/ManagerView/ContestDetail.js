import React, {Component} from 'react';
import {withStyles, MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import instance from "../../Helpers/AjaxCrtl";
import Header from "../Header";
import Grid from "@material-ui/core/es/Grid/Grid";
import Player from "../Player";
import {Pager} from "react-bootstrap";
import Paper from "@material-ui/core/es/Paper/Paper";
import authManager from '../../Helpers/UserManagement.js'
import ErrorMessage from "../../Helpers/ErrorMessage";

class ContestDetail extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.history.location.pathname.split('/')[this.props.history.location.pathname.split('/').length - 1],
      submissions: [],
      playVideo: false,
      sources: '',
      videoSrc: '',
      videoType: '',
      prevButton: false,
      nextButton: false,
      pageNum: 1,
      contest: {}
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.togglePlayer = this.togglePlayer.bind(this);
    this.getData = this.getData.bind(this);
    this.downPage = this.downPage.bind(this);
    this.upPage = this.upPage.bind(this);
    authManager.validateUser();
  }

  componentDidMount() {
    console.log("la ruta", 'contest/single/' + this.props.location.state.url);
    instance().get('contest/single/' + this.props.location.state.url)
      .then((response) => {
        console.log(response.data);
        this.setState({contest: response.data});
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
    this.getData();
  }
  
  getData(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    console.log('location', this.props.location.state.contestName);
    
    instance().get('contest/' + this.props.match.params.contestId + '/submissions/' + this.state.pageNum)
      .then((response) => {
        this.setState({submissions: response.data});
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
    
    instance().get('contest/' + this.props.match.params.contestId + '/submissions/' + this.state.pageNum + 1)
      .then((response) => {
        //SI la siguiente página tiene videos mostrar boton de next
        if (response.data.length !== 0) {
          console.log('vacioo');
          this.setState({nextButton: true})
        }
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
    
  }
  
  togglePlayer() {
    this.setState({playVideo: !this.state.playVideo})
  }
  
  playVideo(videoType, videoId, converted) {
    const contestId = this.props.match.params.contestId;
    
    //Add extension and file type for processed video
    if (converted) {
      if (videoType != 'video/mp4'){
        videoId = videoId + '.mp4';
      }
      videoType = 'video/mp4';
    }
    
    this.setState({sources: '{"type": "' + videoType + '", "src":"' + videoId + '"}'});
    this.setState({videoSrc: '/api/' + contestId + '/video/' + videoId, videoType: videoType});
    
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
    this.setState({prevButton: true});
    this.setState({pageNum: newPage}, this.getData);
  }
  
  downPage(e) {
    e.preventDefault();
    if (this.state.pageNum !== 1) {
      const newPage = this.state.pageNum - 1;
      this.setState({pageNum: newPage}, this.getData)
    }
    else if (this.state.pageNum == 2)
      this.setState({prevButton: false});
  }
  
  render() {
    const {classes} = this.props;
    const props = this.props;
    return (
      <div className="main">
        <MuiThemeProvider theme={THEME}>
          <Header
            {...props}
            isLogged={true}
            brand={'Content manager'}
            color={'info'}/>
          <Grid container className={classes.root} spacing={24}>
            <Grid item xs={8}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="display3" gutterBottom>
                  {this.state.contest.name}
                </Typography>
                <Typography variant="display1" gutterBottom>
                  {this.state.contest.description}
                </Typography>
                <Typography style={{paddingTop: '2%'}} variant="body1" gutterBottom align="right" color="textSecondary">
                  <strong>Start date </strong> {this.formatDate(this.state.contest.startDate)}
                  <br/>
                  <strong>End date </strong> {this.formatDate(this.state.contest.endDate)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <img className={classes.img} src={"/api/contest/" + this.state.contest.id + "/img"}/>
            </Grid>
          </Grid>
          
          <Typography style={{paddingTop: '2%'}} variant="display3" gutterBottom>
            Submissions
          </Typography>
          
          <Pager>
            {this.state.prevButton && <Pager.Item onClick={this.downPage} previous> &larr; Previous Page </Pager.Item>}
            {this.state.nextButton && <Pager.Item onClick={this.upPage} next> Next Page &rarr; </Pager.Item>}
          </Pager>
          
          {this.state.submissions ? (
            <div>
              <Grid container spacing={24}>
                {this.state.submissions.map(submission => (
                  <Grid key={submission.id} item xs={12} sm={4} md={3} xl={3}>
                    <Card style={{padding: 10}}>
                      
                      <CardContent>
                        <Typography gutterBottom variant="headline">
                          {submission.firstName} {submission.lastName}
                        </Typography>
                        <Typography variant='subheading' gutterBottom>
                          <strong>Email: </strong>{submission.email}
                        </Typography>
                        <Typography variant='subheading' gutterBottom>
                          <strong>Date:</strong> {this.formatDate(submission.creationDate)}
                        </Typography>
                        <Typography variant='subheading' gutterBottom>
                          <strong>State:</strong> {submission.state}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary"
                                onClick={() => this.playVideo(submission.videoType, submission.videoId, false)}>
                          Play original
                        </Button>
                        <Button size="small" color="primary"
                                disabled={submission.state == 'Processing'}
                                onClick={() => this.playVideo(submission.videoType, submission.videoId, true)}>
                          Play converted video
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : "No courses found"}
          
          {(this.state.playVideo && this.state.sources !== '') &&
          <Player
            videoType={this.state.videoType}
            videoSrc={this.state.videoSrc}
            sources={this.state.sources}
            togglePlayer={this.togglePlayer}/>}
        
        </MuiThemeProvider>
        {this.state.errorMessage ?
          <ErrorMessage
            close={() => this.setState({errorMessage: null})}
            errorData={this.state.errorMessage}
          /> : null}
      </div>
    );
  }
}


const styles = theme => ({
  
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
    overflow: 'hidden',
    height: 'auto'
    
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 7,
    paddingBottom: theme.spacing.unit * 7,
    height: 300
  },
  flex: {
    flexGrow: 1,
  },
  img: {
    width: 300,
    height: 300
  }
});


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

import React from 'react';
import {withStyles, MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import instance from "../../Helpers/AjaxCrtl";
import Header from "../Header";
import Grid from "@material-ui/core/Grid/Grid";
import Player from "../Player";
import {Pager} from "react-bootstrap";
import Paper from "@material-ui/core/Paper/Paper";
import authManager from '../../Helpers/UserManagement.js'
import ErrorMessage from "../../Helpers/ErrorMessage";

class ContestDetail extends React.Component {
  
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
      contest: {},
      paginationKeys: {0: {}}
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.togglePlayer = this.togglePlayer.bind(this);
    this.getData = this.getData.bind(this);
    this.downPage = this.downPage.bind(this);
    this.upPage = this.upPage.bind(this);
    authManager.validateUser();
  }
  
  componentDidMount() {
    instance().get('contest/single/' + this.props.location.state.url)
      .then((response) => {
        console.log(response.data);
        this.setState({contest: response.data}, this.getData);
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
  }
  
  upPage(e) {
    e.preventDefault();
    const newPage = this.state.pageNum + 1;
    this.setState({pageNum: newPage},  () => this.getData(null, newPage-1));
  }
  
  downPage(e) {
    e.preventDefault();
    if (this.state.pageNum > 1) {
      const newPage = this.state.pageNum - 1;
      this.setState({pageNum: newPage},  () => this.getData(null, newPage-1))
    }
  }
  
  getData(e, pageNum) {
    if (e && e.preventDefault) e.preventDefault();
    if (pageNum == undefined) pageNum = 0;
    instance().post('submissions/' + this.props.match.params.contestId + '/paginated',
      this.state.paginationKeys[pageNum])
      .then((response) => {
        let paginationKey = { lastEvaluatedPage : {
            "id": {
              "S": response.data.results[response.data.results.length-1].id+''
            },
            "creationDate": {
              "N": response.data.results[response.data.results.length-1].creationDate+''
            },
            "contestId": {
              "S": response.data.results[response.data.results.length-1].contestId
            }
          }};
        this.setState({
          submissions: response.data.results,
          nextButton: response.data.lastEvaluatedKey != null,
          prevButton: this.state.pageNum > 1,
          paginationKeys: {
            ...this.state.paginationKeys,
            [this.state.pageNum]: response.data.lastEvaluatedKey != null ? paginationKey: {}
          }
        });
      }).catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
  }
  
  togglePlayer() {
    console.log(this.state.playVideo)
    this.setState({playVideo: !this.state.playVideo})
  }
  
  playVideo(videoType, videoId, converted) {
    const contestId = this.props.match.params.contestId;
    
    //Add extension and file type for processed video
    let videoSrc = 'https://s3.us-east-2.amazonaws.com/modeld-videos/raw/'+videoId;
    if (converted) {
      if (videoType != 'video/mp4'){
        videoId = videoId + '.mp4';
      }
      videoType = 'video/mp4';
      //TODO: Here goes the cloudfront url
      // videoSrc = '/api/' + contestId + '/video/' + videoId + '/converted';
    }
    
    this.setState({videoSrc: videoSrc, videoType: videoType}, () => this.togglePlayer());
  }
  
  formatDate(date) {
    
    let d = new Date(date);
    let day = d.getDate();
    let monthIndex = d.getMonth();
    let month = monthIndex < 8 ? "0" + (monthIndex + 1) : monthIndex + 1;
    let year = d.getFullYear();
    
    return year + "-" + month + "-" + day;
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
                <Typography variant="Subheading" gutterBottom>
                  <a target="_blank" href={'/public/contest/'+this.state.contest.url}>Click here</a> to watch your contest's public page:
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <img className={classes.img} src={'https://s3.us-east-2.amazonaws.com/modeld-images/'+this.state.contest.bannerUrl}/>
            </Grid>
          </Grid>
          
          <Typography style={{paddingTop: '2%'}} variant="display3" gutterBottom>
            Submissions
          </Typography>
  
          <Pager>
            <Pager.Item disabled={!this.state.prevButton} className='pager2'
                        onClick={(e) => {this.setState({prevButton: false}); this.downPage(e)}}
                        previous>
              &larr; Previous Page
            </Pager.Item>
            <Pager.Item disabled={!this.state.nextButton} className='pager2'
                        onClick={(e) => {this.setState({nextButton: false}); this.upPage(e)}}
                        next>
              Next Page &rarr;
            </Pager.Item>
          </Pager>
          
          {/*<Pager>*/}
            {/*{this.state.prevButton && <Pager.Item onClick={this.downPage} previous> &larr; Previous Page </Pager.Item>}*/}
            {/*{this.state.nextButton && <Pager.Item onClick={this.upPage} next> Next Page &rarr; </Pager.Item>}*/}
          {/*</Pager>*/}
          
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
                        <Typography variant='subheading' gutterBottom>
                          <strong>Description:</strong> {submission.description}
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
          
          {(this.state.playVideo) &&
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
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import instance from "../../Helpers/AjaxCrtl.js"
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper/Paper";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Header from "../Header";
import Grid from "@material-ui/core/Grid/Grid";
import {Pager} from "react-bootstrap";
import Player from "../Player";
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import ErrorMessage from "../../Helpers/ErrorMessage";
import BrowserHistory from '../../Helpers/BrowserHistory.js'

class ContestPublic extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      description: "",
      video: null,
      create: false,
      contest: {},
      pageNum: 1,
      videoId: 0,
      submissions: [],
      success: false,
      loading: false,
      prevButton: false,
      nextButton: false,
      error: null,
      showDialogMessage : false,
      paginationKeys: {0: {}}
    };
    
    this.hideCreate = this.hideCreate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getSubmissions = this.getSubmissions.bind(this);
    this.createSub = this.createSub.bind(this);
    this.sendVideo = this.sendVideo.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.upPage = this.upPage.bind(this);
    this.downPage = this.downPage.bind(this);
    this.togglePlayer = this.togglePlayer.bind(this);
    this.playVideo = this.playVideo.bind(this);
  }
  
  static contextTypes = {
    router: PropTypes.object
  };
  
  componentDidMount() {
    const url = this.props.match.params.contestUrl;
    instance().get('contest/single/' + url)
      .then((response) => {
        this.setState({contest: response.data}, this.getSubmissions);
      }).catch((error) => {
      this.setState({
        errorMessage: error.response,
        errorAfterFunction : () => BrowserHistory.push('/')
      });
      console.log(error.response)
    });
  }
  
  handleMessageClose(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.setState({showDialogMessage: false});
  }
  
  upPage(e) {
    e.preventDefault();
    const newPage = this.state.pageNum + 1;
    this.setState({pageNum: newPage}, () => this.getSubmissions(null, newPage-1));
  }
  
  downPage(e) {
    e.preventDefault();
    if (this.state.pageNum > 1) {
      const newPage = this.state.pageNum - 1;
      this.setState({pageNum: newPage}, () => this.getSubmissions(null, newPage-1))
    }
  }
  
  getSubmissions(e, pageNum) {
    if (e && e.preventDefault) e.preventDefault();
    if (pageNum == undefined) pageNum = 0;
    instance().post('public/submissions/' + this.state.contest.id + '/paginated', this.state.paginationKeys[pageNum])
      .then((response) => {
        console.log(response.data);
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
        }, () => console.log(JSON.stringify(this.state.paginationKeys)));
      }).catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error)
    });
  }
  
  hideCreate(e) {
    e.preventDefault();
    this.setState({create: false});
  }
  
  createSub(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.setState({
        success: false,
        loading: true,
      }, () => {
      instance().post('contestSubmission', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        contestUrl: this.props.match.url,
        description: this.state.description,
        contestId: this.state.contest.id
      }).then((response) => {
        this.setState({videoId: response.data.id}, this.sendVideo);
      }).catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
    });

  }
  
  sendVideo() {
    let formData = new FormData();
    formData.append('video', this.state.video);
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    instance().post('contestSubmission/video/' + this.state.videoId, formData, config).then((response) => {
      this.setState({
        create: false,
        success: true,
        showDialogMessage : true,
        loading: false
      });
    }).catch((error) => {
      this.setState({
        create: false,
        success: false,
        loading: false,
        showDialogMessage: true,
        error: error.response});
    });
    // if (!this.state.loading) {
    //   this.setState({
    //     success: false,
    //     loading: true,
    //   }, () => {
    //     l
    //   });
    // }
  }
  
  showMessage() {
    if (this.state.error != null)
      return (
        <Dialog
          open={this.state.showDialogMessage}
          onClose={this.handleMessageClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Error: " + this.state.error.message}</DialogTitle>
          <DialogActions>
            <Button onClick={() => { this.setState({error: null, loading: true}) }} color="primary" autoFocus>
              Try again
            </Button>
          </DialogActions>
        </Dialog>
      )
    else
      return (
        <Dialog
          open={this.state.success && this.state.showDialogMessage}
          onClose={this.handleMessageClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title">{"Your video was received. An email will be sent when it's available. Thank you for participating!"}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleMessageClose} color="primary" autoFocus>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      )
  }
  
  showCreate() {
    const { loading, success } = this.state;
    const { classes } = this.props;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });
    return (
      <Dialog
        open={this.state.create}
        fullScreen={this.props.fullScreen}>
        <form onSubmit={this.createSub}>
          <DialogTitle>Submit Video</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the video information below.
            </DialogContentText>
            <TextField
              margin="dense"
              id="firstName"
              label="First name"
              type="text"
              value={this.state.firstName}
              onChange={(e) => this.setState({firstName: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="lastName"
              label="Last Name"
              type="text"
              value={this.state.lastName}
              onChange={(e) => this.setState({lastName: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              value={this.state.email}
              onChange={(e) => this.setState({email: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              label="Video Description"
              type="text"
              value={this.state.description}
              onChange={(e) => this.setState({description: e.target.value})}
              required
              fullWidth
            />
            <label htmlFor='videoTag' className='videoLabel'>
              Choose file:
            <input
              type="file"
              accept="video/*"
              label="Video"
              required
              onChange={(e) => this.setState({video: e.target.files[0]})}
            />
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideCreate} color="primary">
              Cancel
            </Button>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                className={buttonClassname}
                disabled={loading}
                type="submit"
                onClick={this.handleButtonClick}
              >
                Send
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            {/*<Button color="primary" type="submit">*/}
              {/*Submit*/}
            {/*</Button>*/}
          </DialogActions>
        </form>
      </Dialog>
    )
  }
  
  formatDate(date) {
    let d = new Date(date);
    let day = d.getDate();
    let monthIndex = d.getMonth();
    let month = monthIndex < 8 ? "0" + (monthIndex + 1) : monthIndex + 1;
    let year = d.getFullYear();
    
    return year + "-" + month + "-" + day;
  }
  
  togglePlayer() {
    this.setState({playVideo: !this.state.playVideo})
  }
  
  playVideo(videoType, videoId) {
    videoId += '.mp4';
    this.setState({
      videoSrc: ('https://d2wjn220snb47x.cloudfront.net/' + videoId),
      videoType: 'video/mp4'
    });
    this.togglePlayer();
  }
  
  
  render() {
    const {classes} = this.props;
    const props = this.props;
    return (
      <div className="main">
        <MuiThemeProvider theme={THEME}>
          <Header
            {...props}
            isLogged={false}
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
              <img className={classes.img} src={'https://s3.amazonaws.com/smarttools-images/'+this.state.contest.bannerUrl}/>
            </Grid>
          </Grid>
          <div style={{padding: 24, textAlign: 'center'}}>
            <Button size="large" style={{textAlign: 'center'}} variant="contained" color="primary"
                    onClick={() => this.setState({create: true})}>Add Video</Button>
          </div>
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
                          <strong>Description: </strong>{submission.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary" disabled={submission.state == 'Waiting'}
                                onClick={() => this.playVideo(submission.videoType, submission.videoId)}>
                          Play video
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : "No courses found"}
          {this.showCreate()}
          {this.showMessage()}
          {(this.state.playVideo) &&
          <Player videoType={this.state.videoType}
                  videoSrc={this.state.videoSrc}
                  togglePlayer={this.togglePlayer}/>
          }
        </MuiThemeProvider>
        {this.state.errorMessage ?
          <ErrorMessage
            close={() => {
              this.setState({errorMessage: null});
              if (this.state.errorAfterFunction)
                this.state.errorAfterFunction();
            }}
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
    height: 'auto',
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
  },
  button: {}
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


ContestPublic.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContestPublic);
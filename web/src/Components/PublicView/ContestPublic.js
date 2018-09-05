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
import Grid from "@material-ui/core/es/Grid/Grid";
import {Pager} from "react-bootstrap";
import Player from "../Player";


class ContestPublic extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      firtsName: "",
      lastName: "",
      email: "",
      desc: "",
      video: null,
      create: false,
      contest: {},
      pageNum: 1,
      videoId: 0,
      submissions: [],
      success: false,
      loading: true,
      prevButton: true,
      nextButton: false,
      error: null
    };
    
    this.hideCreate = this.hideCreate.bind(this);
    this.viewCreate = this.viewCreate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getSubs = this.getSubs.bind(this);
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
  }
  
  componentDidMount() {
    const url = this.props.match.params.contestUrl;
    instance().get('contest/single/' + url)
      .then((response) => {
        this.setState({contest: response.data}, this.getSubs);
      }).catch((error) => {
      console.log(error.response)
    });
  }
  
  handleMessageClose(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.setState({loading: true});
  }
  
  getSubs(e) {
    if (e && e.preventDefault) e.preventDefault();
    instance().get('public/submissions/' + this.state.contest.id + '/' + this.state.pageNum)
      .then((response) => {
        if (response.data.length > 0) this.setState({submissions: response.data});
        else this.setState({nextButton: true});
      }).catch((error) => {
      console.log(error.response)
    });
  }
  
  hideCreate(e) {
    e.preventDefault();
    this.setState({create: false});
  }
  
  createSub(e) {
    if (e && e.preventDefault) e.preventDefault();
    instance().post('contestSubmission', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      description: this.state.description,
      contestId: this.state.contest.id
    }).then((response) => {
      this.setState({videoId: response.data.id}, this.sendVideo);
    }).catch((error) => {
      console.log(error.response)
    });
  }
  
  sendVideo(e) {
    if (e && e.preventDefault) e.preventDefault();
    let formData = new FormData();
    formData.append('video', this.state.video);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    instance().post('contestSubmission/video/' + this.state.videoId, formData, config)
      .then((response) => {
        this.setState({create: false, success: true, loading: false});
      }).catch((error) => {
      this.setState({create: false, success: false, loading: false, error: error.response});
    });
  }
  
  viewCreate(e) {
    e.preventDefault();
    this.setState({create: true});
  }
  
  upPage(e) {
    e.preventDefault();
    const newPage = this.state.pageNum + 1;
    this.setState({pageNum: newPage}, this.getSubs);
  }
  
  downPage(e) {
    e.preventDefault();
    if (this.state.pageNum !== 1) {
      const newPage = this.state.pageNum - 1;
      this.setState({pageNum: newPage}, this.getSubs)
    }
    else this.setState({prevButton: true});
  }
  
  showMessage() {
    if (this.state.error != null)
      return (
        <Dialog
          open={this.state.error != null && !this.state.loading}
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
          open={this.state.success && !this.state.loading}
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
              value={this.state.desc}
              onChange={(e) => this.setState({desc: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="video"
              label="Video"
              accept="video/*"
              type="file"
              onChange={(e) => this.setState({video: e.target.files[0]})}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideCreate} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
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
    this.setState({sources: '{"type": "' + videoType + '", "src":"' + videoId + '"}'});
    this.setState({
      videoSrc: '/api/' + this.state.contest.id + '/video/' + videoId + '.mp4',
      videoType: 'video/mp4'
    });
    
    this.togglePlayer();
  }
  
  
  render() {
    const {classes} = this.props;
    const props = this.props;
    return (
      <div className="main" style={{paddingLeft: '7%', marginTop: '75px'}}>
        <MuiThemeProvider theme={THEME}>
          <Header
            {...props}
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
          <div style={{padding: 24, textAlign: 'center'}}>
            <Button size="large" style={{textAlign: 'center'}} variant="contained" color="primary"
                    onClick={this.viewCreate}>Add Video</Button>
          </div>
          <Typography style={{paddingTop: '2%'}} variant="display3" gutterBottom>
            Submissions
          </Typography>
          <Pager>
            <Pager.Item disabled={this.state.prevButton} onClick={this.downPage} previous> &larr; Previous
              Page </Pager.Item>
            <Pager.Item disabled={this.state.nextButton} onClick={this.upPage} next> Next Page &rarr; </Pager.Item>
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
          {(this.state.playVideo && this.state.sources !== '') &&
          <Player videoType={this.state.videoType}
                  videoSrc={this.state.videoSrc}
                  sources={this.state.sources}
                  togglePlayer={this.togglePlayer}/>
          }
        </MuiThemeProvider>
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
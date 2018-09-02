import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import instance from "../AjaxCrtl.js"
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TableHead from "@material-ui/core/TableHead/TableHead";
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Paper from "@material-ui/core/Paper/Paper";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import Header from "./Header";
import Grow from "@material-ui/core/es/Grow/Grow";
import Grid from "@material-ui/core/es/Grid/Grid";



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
      videoId: 0,
      submissions: [],
      success: false,
      loading: true,
      error: null
    };

    this.hideCreate = this.hideCreate.bind(this);
    this.viewCreate = this.viewCreate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getSubs = this.getSubs.bind(this);
    this.createSub = this.createSub.bind(this);
    this.sendVideo = this.sendVideo.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    const url = this.props.match.params.contestUrl;    
    instance().get('contest/single/' + url)
      .then((response) => {
        this.setState({ contest: response.data }, this.getSubs);
      }).catch((error) => {
        console.log(error.response)
      });
  }

  handleMessageClose(e){
    if (e && e.preventDefault) e.preventDefault();
    this.setState({loading: true});
  }

  getSubs(e) {
    if (e && e.preventDefault) e.preventDefault();
    instance().get('public/submissions/' + this.state.contest.id + '/1')
      .then((response) => {
        this.setState({ submissions: response.data });
      }).catch((error) => {
        console.log(error.response)
      });
  }

  hideCreate(e) {
    e.preventDefault();
    this.setState({ create: false });
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
      this.setState({ videoId: response.data.id }, this.sendVideo);
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
        this.setState({ create: false, success: true, loading: false});  
      }).catch((error) => {
          this.setState({ create: false, success: false, loading: false, error: error.response.data });
        });
  }

  viewCreate(e) {
    e.preventDefault();
    this.setState({ create: true });
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
          <DialogTitle id="alert-dialog-title">{"Error: " + this.state.error.error}</DialogTitle>
          <DialogActions>
            <Button onClick={() => { this.setState({ error: null }) }} color="primary" autoFocus>
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
          <DialogTitle id="alert-dialog-title">{"Your video was received. An email will be sent when it's available. Thak you for participating!"}</DialogTitle>
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
              onChange={(e) => this.setState({ firstName: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="lastName"
              label="Last Name"
              type="text"
              value={this.state.lastName}
              onChange={(e) => this.setState({ lastName: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              label="Video Description"
              type="text"
              value={this.state.desc}
              onChange={(e) => this.setState({ desc: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="video"
              label="Video"
              accept="video/*"
              type="file"
              onChange={(e) => this.setState({ video: e.target.files[0] })}
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

  render() {
    const { classes } = this.props;
    const props = this.props;
    const contestId = 0;
    return (
      <div className="main" style={{ marginTop: '75px' }} >
        <MuiThemeProvider theme={THEME}>
          <Header
            {...props}
            brand={'Content manager'}
            color={'info'} />
          <h3 className="centerAlign">Contest <Button onClick={this.viewCreate}>Add Video</Button></h3>
          {this.state.submissions ? (
            <div>
              <Grid container spacing={24} style={{ padding: 24 }}>
                {this.state.submissions.map(submission => (
                  <Grid item xs={12} sm={4} md={3} xl={3}>
                    <Card style={{ padding: 10 }} key={submission.id} >
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
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          Ver video
                                                </Button>
                      </CardActions>
                    </Card>
                    {submission.videoId != null &&
                      <video width="140" height="100" controls>
                        <source
                          type={submission.videoType}
                          src={'/api/' + contestId + '/video/' + submission.videoId} />
                        Your browser does not support the video tag.
                                          </video>
                    }
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : "No courses found"}
          {this.showCreate()}
          {this.showMessage()}
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


ContestPublic.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContestPublic);
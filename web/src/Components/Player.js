import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/Button/Button";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

class Player extends Component {
  
  constructor() {
    super();
    this.state = {
      success: false,
      loading: false,
      open: true,
      error: null,
      cantPlay: false
    };
/*
    console.log("video data ",this.props.videoSrc,this.props.videoType)
*/
  }
  
  render() {
    return (
      <div>
        <Dialog open={this.state.open}>
          <video width="100%" height="100%"
                 onError={()=>this.setState({cantPlay: true})}
                 controls>
            <source src={this.props.videoSrc} type={this.props.videoType}/>
          </video>
          {this.state.cantPlay &&
          <DialogContent className='playerDialog'>
            <DialogContentText id="alert-dialog-slide-description">
              Unfortunately the player is not reproduce this  video format.
              In a couple of minutes it'll be ready to watch on a supported format.
              Meanwhile, you can download it and watch it on your PC using VLC
            </DialogContentText>
          </DialogContent>
          }
          <DialogActions>
            {/*This works, but only on production because of the react proxy server*/}
            {this.state.cantPlay &&
            <Button color="primary" onClick={() => document.getElementById('link').click()}>
              Download
            </Button>
            }
            <a id="link" href={this.props.videoSrc} download hidden></a>
            <Button onClick={this.props.togglePlayer} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Player;

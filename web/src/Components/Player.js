import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/es/Button/Button";

class Player extends Component {
  
  constructor() {
    super();
    this.state = {
      success: false,
      loading: false,
      open: true,
      error: null
    };
/*
    console.log("video data ",this.props.videoSrc,this.props.videoType)
*/
  }
  
  render() {
    return (
      <div>
        <Dialog open={this.state.open}>
          <video width="100%" height="100%" controls>
            <source src={this.props.videoSrc} type={this.props.videoType}/>
          </video>
          <DialogActions>
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

import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/es/Button/Button";

class Player extends Component{

    constructor() {
        super();
        this.state = {
            success: false,
            loading: false,
            open: true,
            error: null
        };

    }

    close(){

    }

    render() {
        return(
            <div>
{/*                <video
                    className="video-js"
                    controls
                    ref="player">
                </video>*/}
                <Dialog open={this.state.open}>
                    <video width="320" height="240" controls>
                        <source src="/dove.mp4" type="video/mp4"/>
                    </video>
                    <DialogActions>
                        <Button onClick={() => this.setState({open:false})} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>


                </Dialog>
            </div>
        )
    }

    componentDidMount() {
/*        var self = this;
        console.log('player comp', this.props.sources, this.refs.player );
*/
/*
        var player = window.videojs(this.refs.player, {}).ready(() => {
            player.src(JSON.parse(this.props.sources));
            player.play();
        });

        var ModalDialog = window.videojs.getComponent('ModalDialog');

        var modal = new ModalDialog(player, {

            // We don't want this modal to go away when it closes.
            temporary: false
        });

        player.addChild(modal);

        player.on('pause', function() {
            modal.open();
        });

        player.on('play', function() {
            modal.close();
        });
*/

    }

    componentWillUnmount() {
/*
        this.player.dispose();
*/
    }
}

export default Player;

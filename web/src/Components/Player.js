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

    render() {
        return(
            <div>
{/*                <video
                    className="video-js"
                    controls
                    ref="player"
                    data-setup='{ "techOrder": ["java"] }'>
                </video>*/}
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

    componentDidMount() {
/*        console.log('player comp', this.props.sources, this.refs.player );
        var player = window.videojs(this.refs.player, {}).ready(() => {
            player.src(JSON.parse(this.props.sources));
            player.play();
        });*/
/*
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
        });*/

    }

    componentWillUnmount() {
/*
        this.player.dispose();
*/
    }
}

export default Player;

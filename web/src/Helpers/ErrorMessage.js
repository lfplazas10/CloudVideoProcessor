import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import React from "react";

class ErrorMessage extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const props = this.props;
    const message = props.errorData.data.error == null ? props.errorData.statusText : props.errorData.data.error;
    return (
      <Dialog
        open={true}
        onClose={props.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error: "+message}</DialogTitle>
        <DialogActions>
          <DialogActions>
            <Button onClick={props.close} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>
    );
  }
  
}

export default ErrorMessage;
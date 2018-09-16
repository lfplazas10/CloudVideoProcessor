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
    let message = '';
    if (props.errorData.data != null && props.errorData.data.error != null)
      message = props.errorData.data.error;
    else if (props.errorData.data != null)
      message = props.errorData.statusText;
    else
      message = props.errorData;
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